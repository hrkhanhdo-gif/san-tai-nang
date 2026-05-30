'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowLeft, CheckCircle } from 'lucide-react';
import { MotionDiv } from '@/components/motion';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const ChromeIcon = ({ size = 24, ...props }: IconProps) => (
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" x2="12" y1="8" y2="8" />
    <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
    <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
  </svg>
);

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


import { dbHelper } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await dbHelper.login(email, password);
    if (user) {
      setIsSuccess(true);
      window.dispatchEvent(new Event('sntn_login_change'));
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'partner') => {
    const email = role === 'admin' ? 'admin@sntn.vn' : 'partner@sntn.vn';
    const user = await dbHelper.login(email);
    if (user) {
      setIsSuccess(true);
      window.dispatchEvent(new Event('sntn_login_change'));
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#FDFBF7] to-white px-6 py-12 relative overflow-hidden">
      {/* Decorative balls */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <MotionDiv
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white border border-[#D4AF37]/15 rounded-3xl shadow-xl relative z-10"
      >
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-[#D4AF37] font-bold mb-6 transition-colors">
          <ArrowLeft size={14} />
          <span>Về Trang chủ</span>
        </Link>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">Đăng nhập tài khoản</h2>
          <p className="text-xs text-gray-400 font-bold mt-1.5 uppercase tracking-wider">SĂN TÀI NĂNG HR Portal</p>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/30 flex items-center justify-center text-[#B8860B] shadow">
              <CheckCircle size={26} />
            </div>
            <h3 className="text-base font-black text-gray-900">Đăng nhập thành công!</h3>
            <p className="text-xs text-gray-400 font-semibold">Đang chuyển hướng về trang chủ...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Quick Demo Logins */}
            <div className="bg-[#FDFBF7] border border-[#D4AF37]/20 p-4 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider block text-center">
                Đăng nhập nhanh để kiểm thử phân quyền
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="py-2 px-3 bg-gray-900 hover:bg-[#D4AF37] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Admin (Ban quản trị)
                </button>
                <button
                  onClick={() => handleQuickLogin('partner')}
                  className="py-2 px-3 bg-white hover:bg-gray-50 border border-[#D4AF37]/30 text-gray-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Partner (Đối tác HR)
                </button>
              </div>
              <p className="text-[9px] text-gray-400 font-semibold text-center">
                Admin duyệt việc làm & đăng sự kiện. Partner đăng tuyển, xem CV & tương tác.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Địa chỉ Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Mật khẩu</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Chức năng đang phát triển...'); }} className="text-[10px] font-bold text-[#B8860B] hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md flex items-center justify-center space-x-2 mt-2"
              >
                <LogIn size={14} className="stroke-[2.5]" />
                <span>Đăng nhập hệ thống</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Hoặc kết nối qua</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('partner')}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50/5 text-gray-700 text-xs font-bold transition-all"
              >
                <ChromeIcon size={14} className="text-red-500" />
                <span>Google</span>
              </button>
              <button
                onClick={() => handleQuickLogin('partner')}
                className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-gray-200 hover:border-[#0077B5] hover:bg-[#0077B5]/5 text-gray-700 text-xs font-bold transition-all"
              >
                <LinkedinIcon size={14} className="text-[#0077B5]" />
                <span>LinkedIn</span>
              </button>
            </div>

            {/* Join trigger */}
            <p className="text-center text-xs text-gray-500 font-semibold mt-2">
              Chưa có tài khoản cộng đồng?{' '}
              <Link href="/tham-gia-ngay" className="text-[#B8860B] font-bold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        )}
      </MotionDiv>
    </div>
  );
}
