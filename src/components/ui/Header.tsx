'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn, LogOut } from 'lucide-react';
import { MotionDiv } from '../motion';
import { dbHelper, UserSession } from '@/lib/supabase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check session on client mount
    setUser(dbHelper.getCurrentUser());

    const checkUser = () => {
      setUser(dbHelper.getCurrentUser());
    };

    window.addEventListener('storage', checkUser);
    window.addEventListener('sntn_login_change', checkUser);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('sntn_login_change', checkUser);
    };
  }, []);

  const handleLogout = () => {
    dbHelper.logout();
    setUser(null);
    window.dispatchEvent(new Event('sntn_login_change'));
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Về Thuận HN', href: '/ve-thuan-hn' },
    { name: 'Hoạt động', href: '/hoat-dong' },
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
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]/20 shadow-md transition-transform group-hover:scale-110 relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
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

        {/* CTA Button / User Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3 bg-[#FDFBF7] border border-[#D4AF37]/25 px-4 py-2 rounded-2xl shadow-sm">
              <div className="flex flex-col text-right">
                <span className="text-xs font-black text-gray-900 leading-none">{user.fullName}</span>
                <span className="text-[9px] font-extrabold text-[#B8860B] uppercase tracking-wider mt-1 leading-none">
                  {user.role === 'admin' ? 'Ban Quản Trị' : 'Partner (Đối Tác)'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 transition-colors text-gray-500"
                title="Đăng xuất"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <LogIn size={14} className="stroke-[3]" />
              <span>Đăng nhập / Tham gia ngay</span>
            </Link>
          )}
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
          
          {user ? (
            <div className="flex flex-col space-y-2.5 p-3 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/15">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full gradient-gold-bg flex items-center justify-center text-white font-extrabold text-xs">
                  {user.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900 leading-none">{user.fullName}</span>
                  <span className="text-[9px] font-extrabold text-[#B8860B] uppercase tracking-wider mt-1">
                    {user.role === 'admin' ? 'Ban Quản Trị' : 'Partner'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-wider gradient-gold-bg shadow-md"
            >
              <LogIn size={16} className="stroke-[3]" />
              <span>Đăng nhập / Tham gia ngay</span>
            </Link>
          )}
        </MotionDiv>
      )}
    </header>
  );
}

