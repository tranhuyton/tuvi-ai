import { NextRequest, NextResponse } from 'next/server';
import { LaSoData } from '@/types/tuvi';
import { buildReadingBatches, callGeminiVisionBatches } from '@/lib/gemini';
import { lapLaSoTuVi } from '@/lib/tuvi/anSao';
import { adminSupabase } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser, isValidUuid, verifyAdminRequest } from '@/lib/adminAuth';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const maxDuration = 180;

// Giữ mỗi ảnh <= 1.5MB base64 để 2 ảnh + JSON luôn gọn dưới trần 4.5MB của Vercel
const MAX_IMAGE_DATA_URL_LENGTH = 1_500_000;
const ALLOWED_IMAGE_DATA_URL_RE = /^data:image\/(jpeg|jpg|png|webp);base64,/i;

function validateImageDataUrl(img?: unknown): string | undefined {
  if (!img || typeof img !== 'string') return undefined;
  const trimmed = img.trim();
  if (!ALLOWED_IMAGE_DATA_URL_RE.test(trimmed)) return undefined;
  if (trimmed.length > MAX_IMAGE_DATA_URL_LENGTH) return undefined;
  return trimmed;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const adminAuth = await verifyAdminRequest(req);
    const isAdmin = adminAuth.authorized;

    if (!isAdmin) {
      const rl = await checkRateLimitDistributed({
        key: `tuvi_reading:${ip}`,
        limit: 12,
        windowMs: 5 * 60_000,
      });
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Quý khách đang gửi quá nhiều yêu cầu luận giải liên tiếp. Vui lòng thử lại sau ít phút.' },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const {
      laSo,
      tier,
      thongTinThem,
      chieuCao,
      canNang,
      anhMat,
      anhTay,
      apiKey,
      model,
      lang,
      language,
      chartId,
    } = body as {
      laSo: LaSoData;
      tier?: 'free' | 'pro' | 'expert';
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      anhMat?: string;
      anhTay?: string;
      apiKey?: string;
      model?: string;
      lang?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      language?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      chartId?: string;
    };

    if (!laSo || !laSo.duongSo) {
      return NextResponse.json({ error: 'Dữ liệu lá số không hợp lệ' }, { status: 400 });
    }

    const authUser = adminAuth.user || (await getAuthenticatedUser(req));
    const safeChartId = isValidUuid(chartId) ? chartId.trim() : undefined;
    const requestedTier: 'free' | 'pro' | 'expert' =
      tier === 'expert' || laSo.tier === 'expert'
        ? 'expert'
        : tier === 'pro' || laSo.tier === 'pro'
        ? 'pro'
        : 'free';

    interface DbChartRow {
      id: string;
      user_id: string | null;
      duong_so_data: Record<string, unknown> | null;
      laso_data: Record<string, unknown> | null;
      reading_html: string | null;
    }
    let existingChart: DbChartRow | null = null;

    if (safeChartId) {
      const { data } = await adminSupabase
        .from('tuvi_charts')
        .select('id, user_id, duong_so_data, laso_data, reading_html')
        .eq('id', safeChartId)
        .maybeSingle();
      existingChart = (data as DbChartRow | null) || null;
    }

    // CHỐT CHẶN IDOR: Không bao giờ cho người khác sử dụng hoặc ghi đè chartId thuộc tài khoản khác!
    if (!isAdmin && safeChartId && existingChart) {
      if (!authUser || (existingChart.user_id && existingChart.user_id !== authUser.id)) {
        return NextResponse.json(
          { error: 'Quý khách không có quyền truy cập hoặc luận giải lại lá số của tài khoản khác.' },
          { status: 403 }
        );
      }
    }

    let allowedTier: 'free' | 'pro' | 'expert' = 'free';
    let canPersistToChart = false;

    if (isAdmin) {
      allowedTier = requestedTier;
      canPersistToChart = Boolean(safeChartId);
    } else {
      const chartOwnerId = existingChart?.user_id || null;
      const isChartOwner = Boolean(authUser && chartOwnerId && chartOwnerId === authUser.id);
      if (isChartOwner) {
        canPersistToChart = true;
      }

      if (requestedTier === 'free') {
        allowedTier = 'free';
      } else {
        if (!authUser?.id) {
          return NextResponse.json(
            { error: 'Quý khách vui lòng đăng nhập để sử dụng gói Luận Giải Chuyên Sâu / Chuyên Gia.' },
            { status: 401 }
          );
        }

        // 1. Kiểm tra active Tester (chỉ cấp miễn phí tối đa gói Pro & kiểm soát max_charts server-side)
        let isTesterPro = false;
        const cleanAuthEmail = (authUser.email || '').trim().toLowerCase();
        const { data: testerByUid } = await adminSupabase
          .from('tuvi_testers')
          .select('is_active, max_charts')
          .eq('user_id', authUser.id)
          .maybeSingle();

        let testerRow = testerByUid;
        if (!testerRow && cleanAuthEmail) {
          const { data: testerByEmail } = await adminSupabase
            .from('tuvi_testers')
            .select('is_active, max_charts')
            .eq('email', cleanAuthEmail)
            .maybeSingle();
          testerRow = testerByEmail;
        }

        if (testerRow && testerRow.is_active !== false) {
          const maxCharts = Number(testerRow.max_charts || 10);
          const { count: userChartsCount } = await adminSupabase
            .from('tuvi_charts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', authUser.id);
          if ((userChartsCount || 0) <= maxCharts) {
            isTesterPro = true;
          }
        }

        // 2. Kiểm tra đơn hàng PAID thực tế thuộc ĐÚNG tài khoản authUser trên Supabase
        let hasPaidExpert = false;
        let hasPaidPro = isTesterPro;

        if (safeChartId && isChartOwner) {
          const { data: chartOrders } = await adminSupabase
            .from('tuvi_orders')
            .select('id, payment_type, user_id')
            .eq('chart_id', safeChartId)
            .eq('status', 'PAID');

          for (const o of chartOrders || []) {
            if (o.user_id && o.user_id !== authUser.id) continue;
            if (o.payment_type === 'reading_expert' || o.payment_type === 'upgrade_expert') {
              hasPaidExpert = true;
            } else if (o.payment_type === 'reading_vip') {
              hasPaidPro = true;
            }
          }
        }

        // Kiểm tra đơn PAID chưa gắn chart_id của chính user (bắt buộc khớp họ tên khác rỗng và tự gắn chart_id nguyên tử!)
        if (!hasPaidExpert || !hasPaidPro) {
          const { data: userOrders } = await adminSupabase
            .from('tuvi_orders')
            .select('id, payment_type, chart_id, ho_ten')
            .eq('user_id', authUser.id)
            .eq('status', 'PAID');

          const dbHoTen =
            typeof existingChart?.duong_so_data?.hoTen === 'string'
              ? existingChart.duong_so_data.hoTen
              : '';
          const targetName = (dbHoTen || laSo.duongSo?.hoTen || '').trim().toLowerCase();

          for (const o of userOrders || []) {
            const isSameChart = Boolean(safeChartId && o.chart_id === safeChartId);
            const isMatchingUnlinked =
              !o.chart_id &&
              Boolean(targetName) &&
              (o.ho_ten || '').trim().toLowerCase() === targetName;

            if (!isSameChart && !isMatchingUnlinked) continue;

            if (o.payment_type === 'reading_expert' || o.payment_type === 'upgrade_expert') {
              hasPaidExpert = true;
            } else if (o.payment_type === 'reading_vip') {
              hasPaidPro = true;
            }

            // Gắn chart_id nguyên tử phía server ngay lần đầu sử dụng để chống 1 đơn mở khóa nhiều lá số!
            if (isMatchingUnlinked && safeChartId && isChartOwner) {
              await adminSupabase
                .from('tuvi_orders')
                .update({ chart_id: safeChartId })
                .eq('id', o.id)
                .is('chart_id', null);
            }
          }
        }

        // Hỗ trợ các lá số đã được Admin duyệt tặng (trigger BEFORE INSERT OR UPDATE đã chặn user tự sửa tier)
        if (isChartOwner && existingChart) {
          const dbTier = existingChart.duong_so_data?.tier || existingChart.laso_data?.tier;
          if (dbTier === 'expert') hasPaidExpert = true;
          if (dbTier === 'pro') hasPaidPro = true;
        }

        if (requestedTier === 'expert' && hasPaidExpert) {
          allowedTier = 'expert';
        } else if (requestedTier === 'pro' && (hasPaidPro || hasPaidExpert)) {
          allowedTier = 'pro';
        } else {
          return NextResponse.json(
            {
              error:
                requestedTier === 'expert' && isTesterPro
                  ? 'Tài khoản Tester được trải nghiệm miễn phí gói Chuyên Sâu Pro. Để xem gói Chuyên Gia Expert, vui lòng nâng cấp đơn hàng.'
                  : 'Lá số này chưa được kích hoạt gói Luận Giải Chuyên Sâu / Chuyên Gia. Quý khách vui lòng hoàn tất thanh toán để mở khóa.',
            },
            { status: 403 }
          );
        }
      }
    }

    // CHỐNG LẠM DỤNG TRÊN LÁ SỐ TRẢ PHÍ (Pro / Expert):
    // 1. Khóa danh tính đương số (hoTen, gioiTinh, ngay/thang/namDuong, namXem) từ DB để ngăn mua 1 lần luận cho nhiều người / nhiều năm.
    // 2. Giới hạn tối đa 01 lượt chỉnh sửa & luận lại miễn phí (giờ sinh / ảnh tướng pháp / hoàn cảnh) trên cùng gói trả phí đã hoàn tất.
    const MAX_PAID_REGENERATIONS = 1;
    const tierRank: Record<string, number> = { free: 0, pro: 1, expert: 2 };
    const existingDbTier = String(
      existingChart?.duong_so_data?.tier || existingChart?.laso_data?.tier || 'free'
    );
    const hasExistingPaidReading =
      typeof existingChart?.reading_html === 'string' &&
      existingChart.reading_html.trim().length >= 300;
    const existingNeedsUpgrade = Boolean(existingChart?.laso_data?.needsReadingUpgrade);
    const currentPaidEditCount = Number(existingChart?.laso_data?.paidEditCount || 0);
    const isUpgradeOrFirstPaidGeneration =
      (tierRank[allowedTier] ?? 0) > (tierRank[existingDbTier] ?? 0) ||
      !hasExistingPaidReading ||
      existingNeedsUpgrade;

    if (!isAdmin && allowedTier !== 'free' && existingChart && !isUpgradeOrFirstPaidGeneration) {
      if (currentPaidEditCount >= MAX_PAID_REGENERATIONS) {
        return NextResponse.json(
          {
            error:
              'Lá số trả phí này đã hoàn tất bài luận giải và đã sử dụng hết 01 lượt chỉnh sửa miễn phí. Để xem cho người thân hoặc năm hạn khác, quý khách vui lòng lập lá số mới hoặc nhắn Zalo Thầy Tôn (0935.058.688) nếu cần hỗ trợ.',
          },
          { status: 403 }
        );
      }
    }

    let effectiveLaSo: LaSoData = laSo;
    if (!isAdmin && allowedTier !== 'free' && existingChart) {
      const dbLaSo = existingChart.laso_data as unknown as LaSoData | null;
      const dbDuongSo = existingChart.duong_so_data as unknown as LaSoData['duongSo'] | null;
      if (dbDuongSo && dbDuongSo.ngayDuong && dbDuongSo.thangDuong && dbDuongSo.namDuong) {
        // Cho phép cập nhật gioSinhVal trong lượt sửa hợp lệ duy nhất, nhưng luôn khóa cứng danh tính gốc từ DB
        const requestedGioSinh =
          typeof laSo.duongSo?.gioSinhVal === 'string' && laSo.duongSo.gioSinhVal.trim()
            ? laSo.duongSo.gioSinhVal.trim()
            : dbDuongSo.gioSinhVal;
        const lockedDuongSo: LaSoData['duongSo'] = {
          ...dbDuongSo,
          gioSinhVal: requestedGioSinh || dbDuongSo.gioSinhVal,
          tier: allowedTier,
        };
        const lockedNamXem = Number(dbDuongSo.namXem || dbLaSo?.namXem || new Date().getFullYear());
        effectiveLaSo = {
          ...lapLaSoTuVi(
            { ...lockedDuongSo, anhMat: undefined, anhTay: undefined },
            lockedNamXem
          ),
          tier: allowedTier,
          quota: dbLaSo?.quota,
        };
      } else if (dbLaSo && Array.isArray(dbLaSo.cungs) && dbLaSo.cungs.length === 12) {
        effectiveLaSo = {
          ...dbLaSo,
          duongSo: dbDuongSo || dbLaSo.duongSo,
          tier: allowedTier,
        };
      }
    }

    // Chuẩn hóa và giới hạn độ dài tên & ghi chú chống nhồi prompt
    if (effectiveLaSo.duongSo?.hoTen) {
      effectiveLaSo = {
        ...effectiveLaSo,
        duongSo: {
          ...effectiveLaSo.duongSo,
          hoTen: String(effectiveLaSo.duongSo.hoTen).trim().slice(0, 100),
        },
        tier: allowedTier,
      };
    }

    const targetModel =
      isAdmin && model
        ? model
        : allowedTier === 'expert'
        ? 'gemini-4-carbon'
        : allowedTier === 'pro'
        ? 'gemini-3.1-pro-preview'
        : 'gemini-2.5-flash';
    const targetLang = lang || language || 'vi';

    // Chỉ chấp nhận ảnh sinh trắc ở gói Pro/Expert (chống lạm dụng Vision trên gói Free)
    const safeAnhMat =
      allowedTier !== 'free'
        ? validateImageDataUrl(anhMat) || validateImageDataUrl(existingChart?.duong_so_data?.anhMat)
        : undefined;
    const safeAnhTay =
      allowedTier !== 'free'
        ? validateImageDataUrl(anhTay) || validateImageDataUrl(existingChart?.duong_so_data?.anhTay)
        : undefined;

    const safeThongTinThem =
      typeof thongTinThem === 'string'
        ? thongTinThem.trim().slice(0, 1500) || undefined
        : typeof existingChart?.duong_so_data?.thongTinThem === 'string'
        ? existingChart.duong_so_data.thongTinThem.trim().slice(0, 1500) || undefined
        : undefined;
    const safeChieuCao =
      typeof chieuCao === 'number' && Number.isFinite(chieuCao) && chieuCao > 0
        ? chieuCao
        : typeof existingChart?.duong_so_data?.chieuCao === 'number'
        ? existingChart.duong_so_data.chieuCao
        : undefined;
    const safeCanNang =
      typeof canNang === 'number' && Number.isFinite(canNang) && canNang > 0
        ? canNang
        : typeof existingChart?.duong_so_data?.canNang === 'number'
        ? existingChart.duong_so_data.canNang
        : undefined;

    // Nhận diện ngầm khu vực nước ngoài (GeoIP từ Vercel/Cloudflare -> lưu trên chart -> fallback capi_meta của đơn hàng)
    const normalizeCountry = (raw?: unknown): string | undefined => {
      if (typeof raw !== 'string') return undefined;
      const code = raw.trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'T1') return undefined;
      return code;
    };

    const reqGeoCountry = !isAdmin
      ? normalizeCountry(req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry'))
      : undefined;
    const savedChartCountry = normalizeCountry(existingChart?.duong_so_data?.countryCode);
    let resolvedCountryCode = reqGeoCountry || savedChartCountry;

    if (!resolvedCountryCode && (safeChartId || existingChart?.user_id)) {
      try {
        let ordQuery = adminSupabase
          .from('tuvi_orders')
          .select('capi_meta')
          .not('capi_meta', 'is', null)
          .order('created_at', { ascending: false })
          .limit(3);
        if (safeChartId) {
          ordQuery = ordQuery.eq('chart_id', safeChartId);
        } else if (existingChart?.user_id) {
          ordQuery = ordQuery.eq('user_id', existingChart.user_id);
        }
        const { data: ordRows } = await ordQuery;
        for (const row of ordRows || []) {
          const meta = row?.capi_meta as { country?: string } | null;
          const c = normalizeCountry(meta?.country);
          if (c) {
            resolvedCountryCode = c;
            break;
          }
        }
      } catch {
        // ignore GeoIP fallback errors
      }
    }

    const isOverseas = Boolean(resolvedCountryCode && resolvedCountryCode !== 'VN');

    const batches = buildReadingBatches({
      laSo: effectiveLaSo,
      tier: allowedTier,
      thongTinThem: safeThongTinThem,
      chieuCao: safeChieuCao,
      canNang: safeCanNang,
      anhMat: safeAnhMat,
      anhTay: safeAnhTay,
      lang: targetLang,
      isOverseas,
    });

    const result = await callGeminiVisionBatches(
      batches,
      isAdmin ? apiKey : undefined,
      targetModel
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const minLen = targetLang === 'zh' || targetLang === 'ja' || targetLang === 'ko' ? 280 : 500;
    const isValidReadingText =
      Boolean(result.text) &&
      result.text!.trim().length >= minLen &&
      !result.text!.includes('gửi lại đề bài') &&
      !result.text!.includes('thầy đang bận chút xíu');

    if (!isValidReadingText) {
      return NextResponse.json(
        {
          error:
            '❌ Thầy đang định tâm quán tưởng cho khách trước. Quý khách vui lòng thử lại sau giây lát!',
        },
        { status: 503 }
      );
    }

    let savedToDb = false;
    let persistedPaidEditCount = currentPaidEditCount;
    if (safeChartId && canPersistToChart && existingChart && result.text) {
      try {
        const persistedTier =
          (tierRank[allowedTier] ?? 0) >= (tierRank[existingDbTier] ?? 0)
            ? allowedTier
            : existingDbTier;

        // Nếu nâng cấp lên gói mới hoặc luận lần đầu sau khi thanh toán -> paidEditCount = 0; nếu luận lại cùng gói trả phí -> tăng thêm 1
        persistedPaidEditCount =
          allowedTier === 'free'
            ? currentPaidEditCount
            : isUpgradeOrFirstPaidGeneration
            ? 0
            : currentPaidEditCount + 1;

        const updatedDuongSo = existingChart.duong_so_data
          ? {
              ...existingChart.duong_so_data,
              ...(effectiveLaSo.duongSo?.gioSinhVal
                ? { gioSinhVal: effectiveLaSo.duongSo.gioSinhVal }
                : {}),
              tier: persistedTier,
              ...(safeAnhMat ? { anhMat: safeAnhMat } : {}),
              ...(safeAnhTay ? { anhTay: safeAnhTay } : {}),
              ...(safeThongTinThem !== undefined ? { thongTinThem: safeThongTinThem } : {}),
              ...(safeChieuCao !== undefined ? { chieuCao: safeChieuCao } : {}),
              ...(safeCanNang !== undefined ? { canNang: safeCanNang } : {}),
              ...(resolvedCountryCode ? { countryCode: resolvedCountryCode } : {}),
            }
          : undefined;
        const updatedLaSo = {
          ...(existingChart.laso_data || {}),
          ...effectiveLaSo,
          tier: persistedTier,
          needsReadingUpgrade: false,
          paidEditCount: persistedPaidEditCount,
        };

        await adminSupabase
          .from('tuvi_charts')
          .update({
            reading_html: result.text,
            ...(updatedDuongSo ? { duong_so_data: updatedDuongSo } : {}),
            laso_data: updatedLaSo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', safeChartId);
        savedToDb = true;
      } catch (saveErr) {
        console.warn('[READING API] Không thể tự động lưu reading_html từ server:', saveErr);
      }
    }

    return NextResponse.json({
      reading: result.text,
      savedToDb,
      modelUsed: result.modelUsed,
      paidEditCount: persistedPaidEditCount,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
