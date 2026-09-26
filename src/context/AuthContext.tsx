'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: { full_name?: string; email?: string } | null;
  isLoading: boolean;
  isPasswordRecovery: boolean;
  setIsPasswordRecovery: (val: boolean) => void;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, fullName: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error?: string; message?: string }>;
  updatePassword: (newPass: string) => Promise<{ error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('tuvi_profiles')
        .select('full_name, email')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        // Dự phòng lấy từ metadata
        setProfile({
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
          email: currentUser.email,
        });
      }
    } catch {
      setProfile({
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
        email: currentUser.email,
      });
    }
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

  const signUp = async (email: string, pass: string, fullName: string) => {
    try {
      const trimmedEmail = email.trim();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: pass,
        options: {
          data: {
            full_name: fullName.trim(),
            app: 'tuvi',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Tự động lưu vào bảng tuvi_profiles
        await supabase.from('tuvi_profiles').upsert({
          id: data.user.id,
          email: trimmedEmail,
          full_name: fullName.trim(),
          updated_at: new Date().toISOString(),
        });

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
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
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

  const updatePassword = async (newPass: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPass,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user);
      }
      setIsPasswordRecovery(false);
      return { message: 'Mật khẩu đã được cập nhật thành công!' };
    } catch (err: any) {
      return { error: err.message || 'Lỗi cập nhật mật khẩu' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isPasswordRecovery,
        setIsPasswordRecovery,
        signIn,
        signUp,
        signOut,
        refreshProfile,
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
