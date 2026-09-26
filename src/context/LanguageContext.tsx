'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  SUPPORTED_LANGUAGES,
  getTranslation,
  translateCungName,
  translateHourLabel,
  translateCanChi,
  translateNapAm,
  translateTenCuc,
  translateSinhKhac,
  translateThanCu,
  translateAmDuong,
  translateThuanNghich,
  translateStarName,
  LanguageOption,
} from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string, variables?: Record<string, string | number>) => string;
  tCung: (cungName: string) => string;
  tHour: (key: string, fallback?: string) => string;
  tCanChi: (canChi?: string) => string;
  tNapAm: (napAm?: string) => string;
  tTenCuc: (tenCuc?: string) => string;
  tSinhKhac: (sinhKhac?: string) => string;
  tThanCu: (thanCu?: string) => string;
  tAmDuong: (amDuong?: string) => string;
  tThuanNghich: (thuanNghich?: string) => string;
  tStar: (star?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  setLanguage: () => {},
  t: (key: string, fallback?: string, variables?: Record<string, string | number>) => {
    let res = fallback || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        res = res.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return res;
  },
  tCung: (name: string) => name,
  tHour: (key: string, fallback?: string) => fallback || key,
  tCanChi: (val?: string) => val || '',
  tNapAm: (val?: string) => val || '',
  tTenCuc: (val?: string) => val || '',
  tSinhKhac: (val?: string) => val || '',
  tThanCu: (val?: string) => val || '',
  tAmDuong: (val?: string) => val || '',
  tThuanNghich: (val?: string) => val || '',
  tStar: (val?: string) => val || '',
  languages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  // Khôi phục ngôn ngữ đã lưu từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tuvi_language') as Language;
      if (saved && (saved === 'vi' || saved === 'en' || saved === 'zh' || saved === 'ko')) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tuvi_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string, variables?: Record<string, string | number>) => {
    return getTranslation(key, language, fallback, variables);
  };

  const tCung = (cungName: string) => {
    return translateCungName(cungName, language);
  };

  const tHour = (key: string, fallback?: string) => {
    return translateHourLabel(key, language, fallback);
  };

  const tCanChi = (val?: string) => {
    return translateCanChi(val, language);
  };

  const tNapAm = (val?: string) => {
    return translateNapAm(val, language);
  };

  const tTenCuc = (val?: string) => {
    return translateTenCuc(val, language);
  };

  const tSinhKhac = (val?: string) => {
    return translateSinhKhac(val, language);
  };

  const tThanCu = (val?: string) => {
    return translateThanCu(val, language);
  };

  const tAmDuong = (val?: string) => {
    return translateAmDuong(val, language);
  };

  const tThuanNghich = (val?: string) => {
    return translateThuanNghich(val, language);
  };

  const tStar = (val?: string) => {
    return translateStarName(val, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        tCung,
        tHour,
        tCanChi,
        tNapAm,
        tTenCuc,
        tSinhKhac,
        tThanCu,
        tAmDuong,
        tThuanNghich,
        tStar,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
