'use client';

import { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  Send, 
  ArrowLeft
} from 'lucide-react';

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
import Link from 'next/link';
import { dbHelper } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

export default function JoinNow() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    linkedin: '',
    experience: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expNum = parseInt(form.experience) || 0;
    
    await dbHelper.registerMember({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      company: form.company,
      title: form.title,
      linkedin: form.linkedin,
      experience: expNum
    });

    setIsSuccess(true);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      linkedin: '',
      experience: ''
    });

    setTimeout(() => {
      setIsSuccess(false);
      window.location.href = '/cong-dong';
    }, 2000);
  };

  const coreBenefits = [
    { title: 'Mạng lưới 3500+ nhân sự', desc: 'Kết nối trực tiếp các chuyên gia HRBP, Headhunter, TA Lead toàn quốc.' },
    { title: 'Workshop chuyên sâu', desc: 'Cập nhật kiến thức thực chiến và biểu mẫu quy chuẩn miễn phí.' },
    { title: 'Cơ chế Talent Sharing', desc: 'Hợp tác chia sẻ hồ sơ ứng viên tài năng chưa phù hợp tại doanh nghiệp.' }
  ];

  return (
    <div className="bg-white min-h-screen py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column: Value Proposition */}
        <div className="lg:col-span-5 space-y-6">
          <Link href="/" className="inline-flex items-center space-x-1.5 text-xs text-gray-500 hover:text-[#D4AF37] font-bold transition-colors">
            <ArrowLeft size={14} />
            <span>Quay lại Trang chủ</span>
          </Link>

          <div>
            <span className="inline-block text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2.5 py-1 rounded-md mb-3">
              Mạng Lưới Tuyển Dụng Hàng Đầu
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              Đồng hành cùng <br />
              <span className="gradient-gold-text">Săn Tài Năng</span>
            </h1>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Hãy gia nhập cộng đồng của chúng tôi ngay hôm nay để nhận được đầy đủ các đặc quyền kết nối, học tập chuyên môn và gia tăng cơ hội hợp tác tuyển chọn ứng viên cao cấp.
          </p>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {coreBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{benefit.title}</span>
                  <span className="text-xs text-gray-500 font-semibold mt-0.5">{benefit.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee card */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/15 flex items-start space-x-3 text-xs text-gray-500 font-semibold leading-relaxed">
            <Award size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <span>Thành viên gia nhập được thẩm định hồ sơ kỹ càng để đảm bảo môi trường kết nối văn minh, chất lượng và chuyên nghiệp.</span>
          </div>
        </div>

        {/* Right column: Signup Form */}
        <div className="lg:col-span-7">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-xl bg-white/70 backdrop-blur-sm"
          >
            <h2 className="text-xl font-black text-gray-900 mb-1">Đăng ký tham gia cộng đồng</h2>
            <p className="text-xs font-semibold text-gray-500 mb-6">
              Điền đầy đủ thông tin để hoàn tất hồ sơ đăng ký thành viên.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSuccess ? (
                <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center flex flex-col items-center justify-center space-y-2 font-bold text-sm">
                  <CheckCircle size={28} />
                  <span>Đăng ký thành công! Đang lưu thông tin và chuyển hướng...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Email công việc *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0987654321"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>

                    {/* Experience */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Số năm làm trong ngành HR *</label>
                      <input
                        type="number"
                        required
                        placeholder="Ví dụ: 5"
                        min="0"
                        value={form.experience}
                        onChange={(e) => setForm({ ...form, experience: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tên đơn vị công tác *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Job Service Connect"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Chức danh công việc *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: TA Lead, HRBP"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                      <LinkedinIcon size={12} className="text-[#D4AF37]" />
                      <span>Đường dẫn LinkedIn cá nhân *</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md flex items-center justify-center space-x-2 mt-2"
                  >
                    <Send size={14} />
                    <span>Nộp đơn tham gia cộng đồng</span>
                  </button>
                </>
              )}
            </form>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}
