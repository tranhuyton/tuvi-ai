import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const beVietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tử Vi Thầy Tôn - Lập Lá Số, Xem Tướng & Luận Giải Mệnh Số',
  description:
    'Hệ thống lập lá số Tử Vi 108 sao cổ truyền kết hợp phân tích Diện Tướng khuôn mặt, Thủ Tướng bàn tay và bình giải chuyên sâu từ Thầy Tôn.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
