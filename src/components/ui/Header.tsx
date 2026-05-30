'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Users, LogIn } from 'lucide-react';
import { MotionDiv } from '../motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Về Thuận HN', href: '/ve-thuan-hn' },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Việc làm', href: '/viec-lam' },
    { name: 'Cộng đồng', href: '/cong-dong' },
    { name: 'Liên hệ', href: '/lien-he' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'header-glass py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl gradient-gold-bg flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-110">
            <Users size={22} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-gray-900 group-hover:text-[#D4AF37] transition-colors leading-none">
              SĂN TÀI NĂNG
            </span>
            <span className="text-[9px] font-bold text-[#B8860B] tracking-widest uppercase mt-0.5">
              HR Community
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 hover:text-[#D4AF37] ${
                  isActive ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <Link
            href="/tham-gia-ngay"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <LogIn size={14} className="stroke-[3]" />
            <span>Đăng nhập / Tham gia ngay</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-800 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-6 px-6 md:hidden flex flex-col space-y-4"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-bold py-2 border-b border-gray-50 transition-colors ${
                  isActive ? 'text-[#D4AF37]' : 'text-gray-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/tham-gia-ngay"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-wider gradient-gold-bg shadow-md"
          >
            <LogIn size={16} className="stroke-[3]" />
            <span>Đăng nhập / Tham gia ngay</span>
          </Link>
        </MotionDiv>
      )}
    </header>
  );
}
