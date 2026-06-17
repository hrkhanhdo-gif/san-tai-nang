import Link from 'next/link';
import { Mail, Phone, MapPin, Users } from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const LinkedinIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FDFBF7] border-t border-[#D4AF37]/10 py-16 text-gray-800 relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl gradient-gold-bg flex items-center justify-center text-white font-bold shadow-md">
              <Users size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-gray-900 leading-none">
                SĂN TÀI NĂNG
              </span>
              <span className="text-[8px] font-bold text-[#B8860B] tracking-widest uppercase mt-0.5">
                HR Community
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            &ldquo;Kết nối nhân tài – Mở rộng cơ hội nghề nghiệp&rdquo;
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Nền tảng kết nối nghề nghiệp, chia sẻ cơ hội việc làm, hợp tác tuyển dụng và phát triển chuyên môn cho người làm nhân sự tại Việt Nam.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-[#D4AF37]/20 pb-2">
            Liên kết nhanh
          </h4>
          <ul className="space-y-2.5 text-sm font-medium">
            {[
              { name: 'Trang chủ', href: '/' },
              { name: 'Về Thuận HN', href: '/ve-thuan-hn' },
              { name: 'Hoạt động', href: '/hoat-dong' },
              { name: 'Việc làm', href: '/viec-lam' },
              { name: 'Cộng đồng', href: '/cong-dong' },
              { name: 'Liên hệ', href: '/lien-he' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info Section */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-[#D4AF37]/20 pb-2">
            Thông tin liên hệ
          </h4>
          <ul className="space-y-3.5 text-sm text-gray-600 font-medium">
            <li className="flex items-start space-x-3">
              <Phone size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <a href="tel:+84986162568" className="hover:text-[#D4AF37] transition-colors">
                +84 98 61 62 568
              </a>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <a href="mailto:ttg.thuanhn@gmail.com" className="hover:text-[#D4AF37] transition-colors break-all">
                ttg.thuanhn@gmail.com
              </a>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span>KDC Lê Thành, Phường An Lạc, Quận Bình Tân, TP.HCM</span>
            </li>
          </ul>
        </div>

        {/* Executive Info / JSC */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-[#D4AF37]/20 pb-2">
            Đơn vị điều hành
          </h4>
          <div className="p-4 rounded-xl bg-white border border-[#D4AF37]/10 flex flex-col space-y-2">
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-wider">
              CEO Hàng Nghĩa Thuận
            </span>
            <span className="text-sm font-black text-gray-800">
              JOB SERVICE
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Công ty chuyên nghiệp trong lĩnh vực Headhunt, Tuyển dụng và Cung cấp giải pháp nhân sự cấp cao toàn diện.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <a
                href="https://www.linkedin.com/in/hangnghiathuan/"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-gray-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-gray-600 hover:text-[#D4AF37] flex items-center justify-center transition-all"
              >
                <LinkedinIcon size={14} />
              </a>
              <a
                href="https://www.linkedin.com/in/hangnghiathuan/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 font-bold hover:text-[#D4AF37] hover:underline transition-colors"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-gray-200/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-medium">
        <span>&copy; {currentYear} Săn Tài Năng HR Community. All rights reserved.</span>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/tham-gia-ngay" className="hover:text-[#D4AF37]">Điều khoản hoạt động</Link>
          <Link href="/lien-he" className="hover:text-[#D4AF37]">Chính sách bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
