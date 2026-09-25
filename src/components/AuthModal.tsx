'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, Mail, User, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';

export type AuthModalTab = 'signin' | 'signup' | 'forgot' | 'update_password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthModalTab;
  customNotice?: string;
  onSuccess?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'signin',
  customNotice,
  onSuccess,
}: AuthModalProps) {
  const { signIn, signUp, resetPasswordForEmail, updatePassword, setIsPasswordRecovery } = useAuth();
  const [tab, setTab] = useState<AuthModalTab>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setErrorMsg('');
      setSuccessMsg('');
      setIsLoading(false);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsPasswordRecovery(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    // 1. Luồng Đăng Nhập
    if (tab === 'signin') {
      const res = await signIn(email, password);
      if (res.error) {
        if (res.error.includes('Invalid login credentials')) {
          setErrorMsg('Email hoặc mật khẩu không chính xác.');
        } else {
          setErrorMsg(res.error);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (onSuccess) {
          onSuccess();
        } else {
          handleClose();
        }
      }
      return;
    }

    // 2. Luồng Đăng Ký
    if (tab === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Vui lòng nhập Họ và tên của bạn.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Mật khẩu cần tối thiểu 6 ký tự.');
        setIsLoading(false);
        return;
      }

      const res = await signUp(email, password, fullName);
      if (res.error) {
        if (res.error.includes('already registered')) {
          setErrorMsg('Email này đã được đăng ký tài khoản.');
        } else {
          setErrorMsg(res.error);
        }
        setIsLoading(false);
      } else {
        setSuccessMsg('Đăng ký thành công! Đang tự động chuyển tiếp...');
        setIsLoading(false);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            handleClose();
          }
        }, 700);
      }
      return;
    }

    // 3. Luồng Quên Mật Khẩu (Gửi email link đặt lại)
    if (tab === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
        setIsLoading(false);
        return;
      }

      const res = await resetPasswordForEmail(email);
      setIsLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(
          'Đã gửi liên kết khôi phục mật khẩu vào hòm thư! Quý khách vui lòng kiểm tra hộp thư đến (hoặc mục Spam) để bấm link đặt lại mật khẩu.'
        );
      }
      return;
    }

    // 4. Luồng Cập Nhật / Đặt Lại Mật Khẩu Mới
    if (tab === 'update_password') {
      if (password.length < 6) {
        setErrorMsg('Mật khẩu mới cần tối thiểu 6 ký tự.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Xác nhận mật khẩu mới không khớp.');
        setIsLoading(false);
        return;
      }

      const res = await updatePassword(password);
      setIsLoading(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Đặt lại mật khẩu thành công! Bạn đã có thể tiếp tục sử dụng hệ thống.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200">
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề Modal */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            {tab === 'forgot' || tab === 'update_password' ? (
              <KeyRound className="w-6 h-6 animate-pulse text-amber-400" />
            ) : (
              <Sparkles className="w-6 h-6 animate-pulse text-amber-400" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
            {tab === 'signin' && 'Đăng Nhập Tài Khoản'}
            {tab === 'signup' && 'Đăng Ký Thành Viên'}
            {tab === 'forgot' && 'Khôi Phục Mật Khẩu'}
            {tab === 'update_password' && 'Đặt Lại Mật Khẩu Mới'}
          </h2>
          <p className="text-sm sm:text-xs text-slate-300 mt-1">
            {tab === 'forgot'
              ? 'Nhập email tài khoản để nhận liên kết đặt lại mật khẩu an toàn'
              : tab === 'update_password'
              ? 'Thiết lập mật khẩu mới để bảo mật tài khoản của quý khách'
              : 'Lưu giữ trọn vẹn lá số, lời bình giải và lịch sử đàm đạo cùng Thầy Tôn'}
          </p>
        </div>

        {/* Thông báo ngữ cảnh khi được mở từ luồng thanh toán / hỏi đáp */}
        {customNotice && tab !== 'forgot' && tab !== 'update_password' && (
          <div className="mb-5 p-3.5 bg-amber-500/15 border border-amber-500/35 rounded-xl text-amber-200 text-sm sm:text-xs flex items-start gap-2.5 leading-relaxed text-left shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{customNotice}</span>
          </div>
        )}

        {/* Chuyển tab Đăng Nhập / Đăng Ký (Ẩn khi ở chế độ Quên mật khẩu hoặc Đổi mật khẩu) */}
        {(tab === 'signin' || tab === 'signup') && (
          <div className="flex rounded-xl bg-slate-800/80 p-1 mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-base sm:text-sm font-medium rounded-lg transition cursor-pointer ${
                tab === 'signin'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-base sm:text-sm font-medium rounded-lg transition cursor-pointer ${
                tab === 'signup'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        )}

        {/* Thông báo lỗi / thành công */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-sm sm:text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-sm sm:text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-sm sm:text-xs font-semibold text-slate-300 mb-1.5">Họ và tên của bạn</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trần Văn An"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                />
              </div>
            </div>
          )}

          {tab !== 'update_password' && (
            <div>
              <label className="block text-sm sm:text-xs font-semibold text-slate-300 mb-1.5">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                />
              </div>
            </div>
          )}

          {(tab === 'signin' || tab === 'signup') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm sm:text-xs font-semibold text-slate-300">Mật khẩu</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 hover:underline font-medium cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                />
              </div>
            </div>
          )}

          {tab === 'update_password' && (
            <>
              <div>
                <label className="block text-sm sm:text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-xs font-semibold text-slate-300 mb-1.5">Xác nhận mật khẩu mới</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 sm:py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-base sm:text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading
              ? 'Đang xử lý...'
              : tab === 'signin'
              ? 'Đăng Nhập Ngay'
              : tab === 'signup'
              ? 'Tạo Tài Khoản Mới'
              : tab === 'forgot'
              ? 'Gửi Link Đặt Lại Mật Khẩu'
              : 'Lưu Mật Khẩu Mới'}
          </button>

          {tab === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang Đăng Nhập</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
