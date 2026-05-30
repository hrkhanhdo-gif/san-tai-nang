import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SĂN TÀI NĂNG - Kết nối nhân tài, Mở rộng cơ hội nghề nghiệp',
  description: 'Cộng đồng dành riêng cho Recruiter, Headhunter, Talent Acquisition, HRBP, HR Manager và các chuyên gia nhân sự hàng đầu tại Việt Nam.',
  keywords: ['săn tài năng', 'tuyển dụng', 'nhân tài', 'headhunter việt nam', 'hr community', 'job service', 'hàng nghĩa thuận', 'việc làm cấp cao'],
  openGraph: {
    title: 'SĂN TÀI NĂNG - Cộng đồng chia sẻ, kết nối và phát triển Tuyển dụng',
    description: 'Nền tảng kết nối nhân sự, hợp tác tuyển dụng, chia sẻ ứng viên và chia sẻ cơ hội việc làm cao cấp.',
    type: 'website',
    locale: 'vi_VN',
  },
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-[80px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
