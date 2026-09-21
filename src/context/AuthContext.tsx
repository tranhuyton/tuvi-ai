'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: { full_name?: string; email?: string } | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, fullName: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    // 1. Kiểm tra session hiện tại
    const initAuth = async () => {
      try {
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
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
