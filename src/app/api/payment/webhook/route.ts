import { NextResponse } from 'next/server';
import { getOrderByCode, markOrderPaidAtomic } from '@/lib/orderStore';
import { sendPaymentSuccessEmail, sendOfflineBookingAdminAlert } from '@/lib/email';
import { adminSupabase as supabase } from '@/lib/supabaseAdmin';
import { markVoucherUsedAndCancelAllForUser } from '@/lib/voucherStore';
import { decodeOrderCapiMeta, sendMetaCapiEvent } from '@/lib/metaCapi';
import { sendGa4ServerPurchase } from '@/lib/ga4Mp';
import { timingSafeStringEqual } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

interface WebhookAuthResult {
  ok: boolean;
  authenticated: boolean;
  mode: 'secret' | 'compat_unconfigured';
}

function verifyWebhookAuth(req: Request): WebhookAuthResult {
  const configuredSecrets = [
    process.env.SEPAY_WEBHOOK_API_KEY,
    process.env.CASSO_SECURE_TOKEN,
    process.env.PAYMENT_WEBHOOK_SECRET,
  ]
    .map((s) => (s || '').trim())
    .filter(Boolean);

  // Nếu chưa cấu hình biến secret trên Vercel -> chạy chế độ tương thích tạm thời để KHÔNG làm rớt đơn khách thật
  // (Khi nào Anh/Admin thêm SEPAY_WEBHOOK_API_KEY trên Vercel + SePay Dashboard thì tự động chuyển sang xác thực chặt)
  if (configuredSecrets.length === 0) {
    console.warn(
      '[PAYMENT WEBHOOK][WARN] Chưa cấu hình SEPAY_WEBHOOK_API_KEY / CASSO_SECURE_TOKEN / PAYMENT_WEBHOOK_SECRET trên Vercel — chạy chế độ tương thích tạm thời (chỉ khớp đơn PENDING có sẵn trong DB).'
    );
    return { ok: true, authenticated: false, mode: 'compat_unconfigured' };
  }

  const authHeader = (req.headers.get('authorization') || '').trim();
  let extractedAuthToken = '';
  if (/^(?:apikey|bearer)\s+/i.test(authHeader)) {
    extractedAuthToken = authHeader.replace(/^(?:apikey|bearer)\s+/i, '').trim();
  } else if (authHeader) {
    extractedAuthToken = authHeader;
  }

  let queryToken = '';
  try {
    const url = new URL(req.url);
    queryToken = (
      url.searchParams.get('apikey') ||
      url.searchParams.get('api_key') ||
      url.searchParams.get('secret') ||
      ''
    ).trim();
  } catch {
    // ignore malformed URL
  }

  const candidates = [
    extractedAuthToken,
    (req.headers.get('secure-token') || '').trim(),
    (req.headers.get('x-webhook-secret') || '').trim(),
    (req.headers.get('x-sepay-apikey') || '').trim(),
    queryToken,
  ].filter(Boolean);

  const matched = candidates.some((provided) =>
    configuredSecrets.some((expected) => timingSafeStringEqual(provided, expected))
  );
  return { ok: matched, authenticated: matched, mode: 'secret' };
}

/**
 * Trích xuất danh sách mã đơn hàng TVxxxxx / TVxxxxxx:
 * - Pass 1: Ưu tiên ranh giới từ chuẩn (tránh khớp nhầm CTV091234 hay dính ngày đằng sau)
 * - Pass 2: Fallback an toàn cho nội dung ngân hàng dính liền mã giao dịch (vd: 6327WBVNP2F9GQ6WTV682382), vẫn loại trừ tiền tố CTV
 */
function extractOrderCodeCandidates(fields: Array<unknown>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const regexes = [
    /(?<![A-Z0-9])TV\s*[:\-_]?\s*(\d{5,8})(?!\d)/gi,
    /(?<!C)TV\s*[:\-_]?\s*(\d{5,8})/gi,
  ];

  for (const regex of regexes) {
    for (const field of fields) {
      if (!field) continue;
      const str = String(field);
      regex.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(str)) !== null) {
        const candidate = `TV${m[1]}`.toUpperCase();
        if (!seen.has(candidate)) {
          seen.add(candidate);
          out.push(candidate);
        }
      }
    }
  }
  return out;
}

/**
 * Endpoint Webhook nhận thông báo chuyển khoản ngân hàng (SePay / Casso / PayOS)
 */
export async function POST(req: Request) {
  const auth = verifyWebhookAuth(req);
  if (!auth.ok) {
    console.warn('[PAYMENT WEBHOOK] Từ chối request không đúng chữ ký/API Key webhook');
    return NextResponse.json({ success: false, error: 'Unauthorized webhook' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    console.log(`[PAYMENT WEBHOOK] Nhận webhook (${auth.mode}) từ cổng thanh toán`);

    interface IncomingTx {
      orderedFields: Array<unknown>;
      codeCandidate: string;
      amount: number;
      txId: string;
      rawContent: string;
      transferType: 'in' | 'out';
    }

    const txList: IncomingTx[] = [];

    // 1. Casso: { data: [ { description, amount, id, ... } ] }
    if (Array.isArray(payload.data)) {
      for (const item of payload.data) {
        const rawAmt = Number(item.amount || 0);
        txList.push({
          orderedFields: [item.description, item.referenceCode, item.tid],
          codeCandidate: String(item.description || ''),
          amount: Math.abs(rawAmt),
          txId: String(item.id || item.tid || item.referenceCode || ''),
          rawContent: String(item.description || ''),
          transferType: rawAmt < 0 ? 'out' : 'in',
        });
      }
    }
    // 2. SePay: { content, description, transferAmount, transferType, code, id, ... }
    else if (
      payload.transferAmount !== undefined ||
      payload.amount !== undefined ||
      payload.content !== undefined ||
      payload.description !== undefined ||
      payload.code !== undefined
    ) {
      const orderedFields = [
        payload.code,
        payload.content,
        payload.description,
        payload.referenceCode,
        payload.subAccount,
      ];
      const fullContent = orderedFields.filter(Boolean).join(' ');
      const normalizedTransferType = String(payload.transferType || 'in').trim().toLowerCase();

      txList.push({
        orderedFields,
        codeCandidate: fullContent,
        amount: Math.abs(Number(payload.transferAmount || payload.amount || 0)),
        txId: String(payload.id || payload.referenceCode || payload.tid || ''),
        rawContent: fullContent,
        transferType: normalizedTransferType === 'out' ? 'out' : 'in',
      });
    }
    // 3. PayOS: { data: { orderCode, amount, description, ... } }
    else if (payload.data && typeof payload.data === 'object') {
      const pData = payload.data;
      txList.push({
        orderedFields: [pData.orderCode, pData.description, pData.reference],
        codeCandidate: String(pData.orderCode || pData.description || ''),
        amount: Math.abs(Number(pData.amount || 0)),
        txId: String(pData.paymentLinkId || pData.reference || ''),
        rawContent: String(pData.description || ''),
        transferType: 'in',
      });
    }

    if (txList.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Payload không chứa giao dịch nhận diện được' },
        { status: 400 }
      );
    }

    const results = [];

    for (const tx of txList) {
      // 0. Giao dịch Tiền Ra (out) Admin chuyển hoa hồng cho CTV (Nội dung: HOA HONG <MÃ_CTV>)
      const payoutMatch = tx.codeCandidate.match(/(?<![A-Z0-9])HOA\s*HONG\s*[:\-_]?\s*([A-Z0-9_]{2,25})(?![A-Z0-9_])/i);
      if (payoutMatch && tx.amount > 0 && tx.transferType === 'out') {
        const affCode = payoutMatch[1].toLowerCase();
        const { getAffiliateByCode, settleAffiliatePayout } = await import('@/lib/affiliateStore');
        const aff = await getAffiliateByCode(affCode);
        if (aff) {
          const bankTxId = tx.txId ? `sepay_out_${tx.txId}` : undefined;
          const settleRes = await settleAffiliatePayout({
            affiliateId: aff.id,
            amount: Math.round(tx.amount),
            bankTxId,
            note: `Tự động trừ số dư qua VietQR (${bankTxId || 'bank_out'})`,
          });
          if (settleRes.alreadyProcessed) {
            results.push({ code: `PAYOUT_${affCode.toUpperCase()}`, status: 'ALREADY_PROCESSED' });
          } else if (settleRes.ok) {
            console.log(
              `[PAYMENT WEBHOOK] ĐÃ TỰ ĐỘNG TRỪ SỐ DƯ RÚT TIỀN ${tx.amount.toLocaleString('vi-VN')}đ CHO CTV ${affCode}`
            );
            results.push({
              code: `PAYOUT_${affCode.toUpperCase()}`,
              affiliateCode: affCode,
              amount: tx.amount,
              status: 'PAYOUT_CONFIRMED',
            });
          } else {
            console.warn('[PAYMENT WEBHOOK] Không thể quyết toán CTV:', settleRes.error);
            results.push({
              code: `PAYOUT_${affCode.toUpperCase()}`,
              status: 'PAYOUT_REJECTED',
              error: settleRes.error,
            });
          }
          continue;
        }
      }

      if (tx.transferType === 'out') {
        console.log('[PAYMENT WEBHOOK] Bỏ qua giao dịch tiền ra thông thường:', tx.rawContent);
        results.push({ code: tx.txId || 'OUT_TX', status: 'IGNORED_OUTGOING_TX' });
        continue;
      }

      // 1. Tìm tất cả mã đơn TVxxxxx đúng ranh giới từ và thử khớp với DB
      const candidates = extractOrderCodeCandidates(tx.orderedFields);
      let order = null;
      let matchedCode: string | null = null;

      for (const cand of candidates) {
        const found = await getOrderByCode(cand);
        if (found) {
          order = found;
          matchedCode = cand;
          break;
        }
      }

      // KHÔNG khớp mù theo số tiền sang đơn PENDING của người dùng bất kỳ (chống cướp đơn / kích hoạt nhầm giao dịch cá nhân!)
      // Chỉ cho phép khởi tạo bản ghi đối soát đơn lạ khi webhook đã có xác thực API Key
      if (!order && auth.authenticated && candidates.length > 0 && tx.amount > 0) {
        matchedCode = candidates[0];
        console.warn(`[PAYMENT WEBHOOK] Đơn ${matchedCode} chưa có trong DB, khởi tạo bản ghi đối soát`);
        const { createOrder } = await import('@/lib/orderStore');
        const pType =
          tx.amount >= 1950000
            ? 'offline_1on1'
            : tx.amount >= 1700000
            ? 'upgrade_offline_1on1'
            : tx.amount >= 699000
            ? 'course_tuvi'
            : tx.amount >= 269000
            ? 'reading_expert'
            : tx.amount === 150000
            ? 'upgrade_expert'
            : tx.amount === 129000
            ? 'chat_expert'
            : tx.amount >= 119000
            ? 'reading_vip'
            : tx.amount >= 99000
            ? 'chat_vip'
            : 'chat_free';
        order = await createOrder({
          customCode: matchedCode,
          paymentType: pType,
          amount: tx.amount,
          hoTen: 'Đương số',
        });
      }

      if (!order) {
        console.warn('[PAYMENT WEBHOOK][UNMATCHED_BANK_TX] Không tìm thấy mã đơn TVxxxxx hợp lệ:', {
          txId: tx.txId,
          amount: tx.amount,
          rawContent: tx.rawContent.slice(0, 200),
        });
        results.push({ code: tx.txId || 'UNMATCHED', status: 'UNMATCHED_MANUAL_REVIEW' });
        continue;
      }

      if (order.status === 'PAID') {
        console.log(`[PAYMENT WEBHOOK] Đơn hàng ${order.orderCode} đã thanh toán trước đó.`);
        results.push({ code: order.orderCode, status: 'ALREADY_PAID' });
        continue;
      }

      // Tuyệt đối không hồi sinh đơn hàng đã bị hủy (CANCELLED)
      if (order.status === 'CANCELLED') {
        console.warn(`[PAYMENT WEBHOOK] Từ chối kích hoạt lại đơn đã hủy ${order.orderCode} — cần Admin đối soát.`);
        results.push({ code: order.orderCode, status: 'ORDER_CANCELLED_REVIEW' });
        continue;
      }

      // Kiểm tra hạn thanh toán cho đơn giảm giá Voucher (cho phép ân hạn 2 giờ phòng nghẽn ngân hàng)
      if (order.voucherCode && order.expiresAt) {
        const expMs = new Date(order.expiresAt).getTime();
        if (Number.isFinite(expMs) && Date.now() > expMs + 2 * 60 * 60 * 1000) {
          console.warn(`[PAYMENT WEBHOOK] Đơn voucher ${order.orderCode} chuyển khoản sau khi quá hạn ưu đãi.`);
          results.push({ code: order.orderCode, status: 'VOUCHER_EXPIRED_REVIEW' });
          continue;
        }
      }

      // Chống gian lận chuyển thiếu tiền hoặc giao dịch 0đ (cho phép sai số nhỏ tối đa 1.000đ)
      if (!Number.isFinite(tx.amount) || tx.amount <= 0 || (order.amount > 0 && tx.amount < order.amount - 1000)) {
        console.warn(
          `[PAYMENT WEBHOOK] Giao dịch ${order.orderCode} không đủ số tiền: nhận ${tx.amount}đ / cần ${order.amount}đ`
        );
        results.push({
          code: order.orderCode,
          status: 'UNDERPAID',
          received: tx.amount,
          expected: order.amount,
        });
        continue;
      }

      const savedCapiMeta = order.capiMeta || decodeOrderCapiMeta(order.transactionId);

      // Chuyển trạng thái PENDING -> PAID hoàn toàn nguyên tử
      const txIdSafe = tx.txId || `bank_${Date.now()}`;
      const { transitioned } = await markOrderPaidAtomic(order.orderCode, txIdSafe);
      if (!transitioned) {
        console.log(`[PAYMENT WEBHOOK] Đơn hàng ${order.orderCode} đã được xử lý đồng thời trước đó.`);
        results.push({ code: order.orderCode, status: 'ALREADY_PAID' });
        continue;
      }
      console.log(`[PAYMENT WEBHOOK] ĐÃ KÍCH HOẠT ĐƠN HÀNG THÀNH CÔNG: ${order.orderCode}`);

      // Tiêu thụ Voucher nguyên tử và hủy mọi Voucher còn lại của khách (Stop-on-Purchase)
      await markVoucherUsedAndCancelAllForUser({
        voucherCode: order.voucherCode,
        orderCode: order.orderCode,
        userId: order.userId,
        email: order.email,
      });

      // CHÍNH SÁCH HOA HỒNG CTV: Đơn có mã giảm giá / discountAmount > 0 => TUYỆT ĐỐI KHÔNG TRẢ HOA HỒNG CTV!
      const isDiscountedOrder = Boolean(order.voucherCode) || Number(order.discountAmount || 0) > 0;
      if (order.affiliateCode && !isDiscountedOrder && !order.commissionRecordedAt) {
        try {
          const { recordAffiliateCommission } = await import('@/lib/affiliateStore');
          const comm = await recordAffiliateCommission(
            order.affiliateCode,
            order.amount,
            order.orderCode,
            order.paymentType,
            order.email
          );
          if (comm > 0) {
            await supabase
              .from('tuvi_orders')
              .update({
                commission_amount: comm,
                commission_recorded_at: new Date().toISOString(),
              })
              .eq('order_code', order.orderCode);
            console.log(
              `[PAYMENT WEBHOOK] Đã cộng hoa hồng ${comm.toLocaleString('vi-VN')}đ cho CTV ${order.affiliateCode}`
            );
          }
        } catch (affErr) {
          console.warn('[PAYMENT WEBHOOK] Lỗi ghi nhận hoa hồng CTV:', affErr);
        }
      }

      // Nâng cấp lá số & quota câu hỏi (bỏ qua với đơn đặt lịch xem trực tiếp 1-1 vì lá số Expert đã có sẵn)
      const isOfflineBookingOrder =
        order.paymentType === 'upgrade_offline_1on1' || order.paymentType === 'offline_1on1';
      if (!isOfflineBookingOrder) {
        try {
          let targetChartId = order.chartId;
          if (!targetChartId && order.userId && order.hoTen) {
            const { data: userCharts } = await supabase
              .from('tuvi_charts')
              .select('id, duong_so_data, laso_data')
              .eq('user_id', order.userId);
            const matched = (userCharts || []).find(
              (c) =>
                String(c.duong_so_data?.hoTen || '').trim().toLowerCase() ===
                order.hoTen.trim().toLowerCase()
            );
            if (matched) {
              targetChartId = matched.id;
              order.chartId = matched.id;
              await supabase.from('tuvi_orders').update({ chart_id: matched.id }).eq('order_code', order.orderCode);
            }
          }

          if (targetChartId) {
            const { data: chartData } = await supabase
              .from('tuvi_charts')
              .select('duong_so_data, laso_data')
              .eq('id', targetChartId)
              .maybeSingle();

            if (chartData) {
              const prevQuota = chartData.laso_data?.quota || {
                basicAllowed: 0,
                proAllowed: 0,
                expertAllowed: 0,
              };
              const nextQuota = {
                basicAllowed: Number(prevQuota.basicAllowed || 0),
                proAllowed: Number(prevQuota.proAllowed || 0),
                expertAllowed: Number(prevQuota.expertAllowed || 0),
              };

              let targetTier = chartData.duong_so_data?.tier || chartData.laso_data?.tier || 'free';
              let needsReadingUpgrade = Boolean(chartData.laso_data?.needsReadingUpgrade);

              if (order.paymentType === 'reading_expert' || order.paymentType === 'upgrade_expert') {
                if (targetTier !== 'expert') {
                  needsReadingUpgrade = true;
                }
                targetTier = 'expert';
                nextQuota.expertAllowed += 2;
              } else if (order.paymentType === 'reading_vip') {
                if (targetTier === 'free') {
                  targetTier = 'pro';
                  needsReadingUpgrade = true;
                }
                nextQuota.proAllowed += 2;
              } else if (order.paymentType === 'chat_expert') {
                nextQuota.expertAllowed += 2;
              } else if (order.paymentType === 'chat_vip') {
                nextQuota.proAllowed += 2;
              } else if (order.paymentType === 'chat_free') {
                nextQuota.basicAllowed += 2;
              }

              const updatedDuongSo = { ...chartData.duong_so_data, tier: targetTier };
              const updatedLaSo = {
                ...chartData.laso_data,
                tier: targetTier,
                quota: nextQuota,
                needsReadingUpgrade,
              };
              await supabase
                .from('tuvi_charts')
                .update({ duong_so_data: updatedDuongSo, laso_data: updatedLaSo })
                .eq('id', targetChartId);
            }
          }
        } catch (e) {
          console.warn('[PAYMENT WEBHOOK] Không thể cập nhật chart:', e);
        }
      }

      // Bắn sự kiện Purchase qua Meta CAPI & GA4 Measurement Protocol (Server-Side)
      let capiSent = false;
      let ga4Sent = false;
      let resolvedEmail: string | null = order.email || null;
      let resolvedPhone: string | null = null;
      try {
        if (order.userId) {
          const [userRes, profRes] = await Promise.all([
            supabase.auth.admin.getUserById(order.userId).catch(() => ({ data: { user: null } })),
            supabase
              .from('tuvi_profiles')
              .select('phone')
              .eq('id', order.userId)
              .maybeSingle(),
          ]);
          const authUser = userRes?.data?.user;
          if (authUser) {
            if (!resolvedEmail && authUser.email) resolvedEmail = authUser.email;
            const metaPhone =
              authUser.phone ||
              authUser.user_metadata?.phone ||
              authUser.user_metadata?.so_dien_thoai ||
              authUser.user_metadata?.phoneNumber;
            if (metaPhone && typeof metaPhone === 'string') resolvedPhone = metaPhone;
          }
          if (!resolvedPhone && profRes?.data?.phone) {
            resolvedPhone = String(profRes.data.phone);
          }
        }

        const [capiOk, ga4Ok] = await Promise.all([
          sendMetaCapiEvent({
            eventName: 'Purchase',
            eventId: order.orderCode,
            value: order.amount,
            currency: 'VND',
            paymentType: order.paymentType,
            orderCode: order.orderCode,
            email: resolvedEmail,
            phone: resolvedPhone,
            fullName: order.hoTen,
            userId: order.userId,
            meta: savedCapiMeta,
          }),
          sendGa4ServerPurchase({
            orderCode: order.orderCode,
            paymentType: order.paymentType,
            amount: order.amount,
            gaClientId: savedCapiMeta?.gaCid,
            gaSessionId: savedCapiMeta?.gaSessionId,
            userId: order.userId,
          }),
        ]);
        capiSent = capiOk;
        ga4Sent = ga4Ok;
      } catch (capiErr) {
        console.warn('[PAYMENT WEBHOOK] Lỗi gửi Server-Side Purchase:', capiErr);
      }

      // Gửi email xác nhận thanh toán cho khách (kèm đề xuất nâng cấp phù hợp theo lịch sử mua)
      let emailResult = null;
      if (order.email) {
        let hasExpertReading = false;
        if (order.paymentType === 'course_tuvi') {
          const { checkUserHasExpertReading } = await import('@/lib/courseAccessServer');
          hasExpertReading = await checkUserHasExpertReading({
            userId: order.userId,
            email: order.email,
          });
        }
        emailResult = await sendPaymentSuccessEmail({
          customerName: order.hoTen,
          customerEmail: order.email,
          orderCode: order.orderCode,
          amount: order.amount,
          paymentType: order.paymentType,
          paidAt: new Date().toISOString(),
          hasExpertReading,
        });
      }

      // Nếu là đơn đặt lịch Xem Trực Tiếp 1-1 (1.730k / 2.000k) -> Gửi ngay email báo Thầy Tôn xếp lịch
      if (isOfflineBookingOrder) {
        sendOfflineBookingAdminAlert({
          customerName: order.hoTen,
          customerEmail: resolvedEmail || order.email,
          customerPhone: resolvedPhone,
          orderCode: order.orderCode,
          amount: order.amount,
          paymentType: order.paymentType,
          chartId: order.chartId,
          paidAt: new Date().toISOString(),
        }).catch((alertErr) => {
          console.warn('[PAYMENT WEBHOOK] Lỗi gửi cảnh báo lịch 1-1 cho Admin:', alertErr);
        });
      }

      results.push({
        code: order.orderCode,
        status: 'PAID',
        emailSent: emailResult?.success ?? false,
        capiSent,
        ga4Sent,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Xử lý webhook thành công',
      results,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi xử lý webhook';
    console.error('[PAYMENT WEBHOOK] Lỗi xử lý webhook:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
