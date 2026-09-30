'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId =
  | 'cosmic'
  | 'amethyst'
  | 'emerald'
  | 'crimson'
  | 'amber'
  | 'ocean'
  | 'obsidian'
  | 'custom';

export interface ThemeConfig {
  id: ThemeId;
  nameKey: string;
  defaultName: string;
  descKey: string;
  defaultDesc: string;
  icon: string;
  color: string; // Color circle / accent
  bgHex: string; // Base background hex
}

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'cosmic',
    nameKey: 'theme.cosmic',
    defaultName: 'Huyền Không Vũ Trụ',
    descKey: 'theme.cosmicDesc',
    defaultDesc: 'Xanh đen ngân hà & ánh vàng hoàng đạo huyền bí',
    icon: '🌌',
    color: '#f59e0b',
    bgHex: '#0a0a0f',
  },
  {
    id: 'amethyst',
    nameKey: 'theme.amethyst',
    defaultName: 'Tử Vi Cung Đình',
    descKey: 'theme.amethystDesc',
    defaultDesc: 'Tím sẫm quyền quý của Đế Tinh Tử Vi & chòm sao',
    icon: '🔮',
    color: '#c084fc',
    bgHex: '#0d0618',
  },
  {
    id: 'emerald',
    nameKey: 'theme.emerald',
    defaultName: 'Thanh Long Bích Ngọc',
    descKey: 'theme.emeraldDesc',
    defaultDesc: 'Xanh bích ngọc thanh tịnh, phong thủy an lành',
    icon: '🍃',
    color: '#34d399',
    bgHex: '#041410',
  },
  {
    id: 'crimson',
    nameKey: 'theme.crimson',
    defaultName: 'Chu Sa Trấn Trạch',
    descKey: 'theme.crimsonDesc',
    defaultDesc: 'Đỏ trầm chu sa quyền uy, vượng khí hanh thông',
    icon: '🏮',
    color: '#f87171',
    bgHex: '#160606',
  },
  {
    id: 'amber',
    nameKey: 'theme.amber',
    defaultName: 'Cổ Thư Mặc Sắc',
    descKey: 'theme.amberDesc',
    defaultDesc: 'Nâu trầm thư phòng cổ kính & ánh hổ phách ấm cúng',
    icon: '📜',
    color: '#fbbf24',
    bgHex: '#140f0a',
  },
  {
    id: 'ocean',
    nameKey: 'theme.ocean',
    defaultName: 'Hải Hà Minh Châu',
    descKey: 'theme.oceanDesc',
    defaultDesc: 'Xanh lam thẳm đại dương đêm & ánh sao rạng ngời',
    icon: '🌊',
    color: '#38bdf8',
    bgHex: '#040d1a',
  },
  {
    id: 'obsidian',
    nameKey: 'theme.obsidian',
    defaultName: 'Hắc Diệu Huyền Bí',
    descKey: 'theme.obsidianDesc',
    defaultDesc: 'Đen tuyền sâu thẳm, tối giản tĩnh tâm',
    icon: '🌑',
    color: '#94a3b8',
    bgHex: '#050507',
  },
];

interface ThemeContextType {
  theme: ThemeId;
  customColor: string;
  setTheme: (themeId: ThemeId) => void;
  setCustomColor: (hex: string) => void;
  themes: ThemeConfig[];
  currentThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cosmic',
  customColor: '#0a0a0f',
  setTheme: () => {},
  setCustomColor: () => {},
  themes: THEME_PRESETS,
  currentThemeConfig: THEME_PRESETS[0],
});

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(10, 10, 15, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('cosmic');
  const [customColor, setCustomColorState] = useState<string>('#0a0a0f');

  // Khôi phục theme đã lưu từ localStorage khi khởi động
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tuvi_theme') as ThemeId;
      const savedCustom = localStorage.getItem('tuvi_custom_color');
      if (savedCustom) {
        setCustomColorState(savedCustom);
      }
      if (
        savedTheme &&
        (THEME_PRESETS.some((t) => t.id === savedTheme) || savedTheme === 'custom')
      ) {
        setThemeState(savedTheme);
        applyThemeToDom(savedTheme, savedCustom || '#0a0a0f');
      } else {
        applyThemeToDom('cosmic', '#0a0a0f');
      }
    } catch {
      applyThemeToDom('cosmic', '#0a0a0f');
    }
  }, []);

  const applyThemeToDom = (targetTheme: ThemeId, customHex: string) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-theme', targetTheme);

    if (targetTheme === 'custom') {
      root.style.setProperty('--bg-color', customHex);
      root.style.setProperty('--bg-overlay-start', hexToRgba(customHex, 0.88));
      root.style.setProperty('--bg-overlay-end', hexToRgba(customHex, 0.96));
      root.style.setProperty('--bg-glow-top', hexToRgba(customHex, 0.25));
      root.style.setProperty('--bg-glow-bottom', hexToRgba(customHex, 0.2));
      root.style.setProperty('--theme-accent', customHex);
    } else {
      root.style.removeProperty('--bg-color');
      root.style.removeProperty('--bg-overlay-start');
      root.style.removeProperty('--bg-overlay-end');
      root.style.removeProperty('--bg-glow-top');
      root.style.removeProperty('--bg-glow-bottom');
      root.style.removeProperty('--theme-accent');
    }
  };

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('tuvi_theme', newTheme);
    } catch {
      // ignore
    }
    applyThemeToDom(newTheme, customColor);
  };

  const setCustomColor = (hex: string) => {
    setCustomColorState(hex);
    try {
      localStorage.setItem('tuvi_custom_color', hex);
    } catch {
      // ignore
    }
    if (theme === 'custom') {
      applyThemeToDom('custom', hex);
    }
  };

  const currentThemeConfig =
    THEME_PRESETS.find((t) => t.id === theme) || {
      id: 'custom',
      nameKey: 'theme.custom',
      defaultName: 'Màu Tùy Chỉnh',
      descKey: 'theme.customDesc',
      defaultDesc: 'Màu nền do bạn tự tay lựa chọn',
      icon: '🎨',
      color: customColor,
      bgHex: customColor,
    };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        customColor,
        setTheme,
        setCustomColor,
        themes: THEME_PRESETS,
        currentThemeConfig,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
