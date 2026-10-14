'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { TesterConfig } from '@/types/tester';

interface AuthContextType {
  user: User | null;
  profile: { full_name?: string; email?: string; phone?: string } | null;
  testerInfo: TesterConfig | null;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  setIsPasswordRecovery: (val: boolean) => void;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, fullName: string, phone?: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshTesterInfo: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error?: string; message?: string }>;
  updatePassword: (newPass?: string, fullName?: string, phone?: string) => Promise<{ error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; phone?: string } | null>(null);
  const [testerInfo, setTesterInfo] = useState<TesterConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const fetchTesterInfo = async (email?: string) => {
    if (!email) {
      setTesterInfo(null);
      return;
    }
    try {
      const res = await fetch(`/api/tester/me?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.isTester) {
          setTesterInfo(data);
          return;
        }
      }
    } catch {
      // ignore
    }
    setTesterInfo(null);
  };

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('tuvi_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile({
          full_name: data.full_name || currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
          email: data.email || currentUser.email,
          phone: data.phone || currentUser.user_metadata?.phone || '',
        });
      } else {
        // Dự phòng lấy từ metadata
        setProfile({
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
          email: currentUser.email,
          phone: currentUser.user_metadata?.phone || '',
        });
      }
    } catch {
      setProfile({
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
        email: currentUser.email,
        phone: currentUser.user_metadata?.phone || '',
      });
    }

    // Tự động kiểm tra quyền hạn Tester
    await fetchTesterInfo(currentUser.email);
  };

  useEffect(() => {
    // 1. Kiểm tra session hiện tại và URL recovery token
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const hash = window.location.hash || '';
          const search = window.location.search || '';
          if (hash.includes('type=recovery') || search.includes('reset_password=true')) {
            setIsPasswordRecovery(true);
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user);
        }
      } catch (err) {
        console.error('Lỗi khởi tạo session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // 2. Lắng nghe thay đổi trạng thái đăng nhập
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setTesterInfo(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user);
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Lỗi đăng nhập không xác định' };
    }
  };

  const signUp = async (email: string, pass: string, fullName: string, phone?: string) => {
    try {
      const trimmedEmail = email.trim();
      const trimmedName = fullName.trim();
      const trimmedPhone = phone?.trim() || '';
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: pass,
        options: {
          data: {
            full_name: trimmedName,
            ...(trimmedPhone ? { phone: trimmedPhone } : {}),
            app: 'tuvi',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Tự động lưu vào bảng tuvi_profiles (thử kèm phone, nếu cột phone chưa có thì fallback)
        const { error: upsertErr } = await supabase.from('tuvi_profiles').upsert({
          id: data.user.id,
          email: trimmedEmail,
          full_name: trimmedName,
          ...(trimmedPhone ? { phone: trimmedPhone } : {}),
          updated_at: new Date().toISOString(),
        });
        if (upsertErr) {
          await supabase.from('tuvi_profiles').upsert({
            id: data.user.id,
            email: trimmedEmail,
            full_name: trimmedName,
            updated_at: new Date().toISOString(),
          });
        }

        setUser(data.user);
        await fetchProfile(data.user);
      }

      return {
        message: 'Đăng ký tài khoản thành công!',
      };
    } catch (err: any) {
      return { error: err.message || 'Lỗi đăng ký không xác định' };
    }
  };

  const signOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tuvi_active_session');
      }
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setTesterInfo(null);
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const refreshTesterInfo = async () => {
    if (user?.email) {
      await fetchTesterInfo(user.email);
    }
  };

  const resetPasswordForEmail = async (emailToReset: string) => {
    try {
      const trimmedEmail = emailToReset.trim().toLowerCase();
      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        return { error: 'Vui lòng nhập địa chỉ email hợp lệ.' };
      }

      // 1. Kiểm tra tài khoản có tồn tại trong hệ thống Tử Vi Thầy Tôn hay không
      try {
        const { data: exists, error: checkError } = await supabase.rpc('check_tuvi_user_exists', {
          p_email: trimmedEmail,
        });

        if (!checkError && exists === false) {
          return {
            error: 'Email này chưa được đăng ký trong hệ thống Tử Vi Thầy Tôn. Quý khách vui lòng kiểm tra lại địa chỉ email hoặc bấm Đăng Ký tài khoản mới.',
          };
        }
      } catch (checkErr) {
        console.warn('Không thể kiểm tra tồn tại email qua RPC:', checkErr);
      }

      // 2. Gửi link đặt lại mật khẩu qua Supabase Auth
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.tuvithayton.vn';
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${siteUrl}/?reset_password=true`,
      });

      if (error) {
        return { error: error.message };
      }
      return { message: 'Đã gửi hướng dẫn khôi phục mật khẩu vào hòm thư email của bạn.' };
    } catch (err: any) {
      return { error: err.message || 'Lỗi gửi yêu cầu khôi phục mật khẩu' };
    }
  };

  const updatePassword = async (newPass?: string, fullName?: string, phone?: string) => {
    try {
      const updatePayload: { password?: string; data?: Record<string, any> } = {};
      if (newPass && newPass.trim().length > 0) {
        updatePayload.password = newPass;
      }
      if (fullName !== undefined || phone !== undefined) {
        updatePayload.data = {
          ...(user?.user_metadata || {}),
          ...(fullName !== undefined ? { full_name: fullName.trim() } : {}),
          ...(phone !== undefined ? { phone: phone.trim() } : {}),
        };
      }

      const { data, error } = await supabase.auth.updateUser(updatePayload);

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const updatedName = fullName !== undefined ? fullName.trim() : (data.user.user_metadata?.full_name || profile?.full_name || '');
        const updatedPhone = phone !== undefined ? phone.trim() : (data.user.user_metadata?.phone || profile?.phone || '');

        const { error: upsertErr } = await supabase.from('tuvi_profiles').upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: updatedName,
          phone: updatedPhone,
          updated_at: new Date().toISOString(),
        });
        if (upsertErr) {
          await supabase.from('tuvi_profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: updatedName,
            updated_at: new Date().toISOString(),
          });
        }

        setUser(data.user);
        await fetchProfile(data.user);
      }
      setIsPasswordRecovery(false);
      return {
        message:
          newPass && newPass.trim().length > 0
            ? 'Cập nhật thông tin và mật khẩu thành công!'
            : 'Cập nhật thông tin tài khoản thành công!',
      };
    } catch (err: any) {
      return { error: err.message || 'Lỗi cập nhật thông tin tài khoản' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        testerInfo,
        isLoading,
        isPasswordRecovery,
        setIsPasswordRecovery,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        refreshTesterInfo,
        resetPasswordForEmail,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
