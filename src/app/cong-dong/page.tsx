'use client';

import { useState } from 'react';
import { 
  Users, 
  Share2, 
  BookOpen, 
  Award, 
  UserCheck, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Send,
  Clock
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
import { dbHelper } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

export default function Community() {
  const benefits = [
    {
      icon: Users,
      title: 'Networking toàn quốc',
      desc: 'Mạng lưới kết nối hơn 3500+ thành viên là HR Manager, TA Lead, Headhunter uy tín khắp 3 miền Bắc - Trung - Nam.'
    },
    {
      icon: Share2,
      title: 'Chia sẻ ứng viên',
      desc: 'Cơ chế hợp tác chia sẻ hồ sơ ứng viên tài năng chưa phù hợp tại doanh nghiệp này sang doanh nghiệp khác cần tuyển dụng.'
    },
    {
      icon: BookOpen,
      title: 'Học hỏi chuyên môn',
      desc: 'Diễn đàn trao đổi kiến thức tuyển dụng thực chiến, chia sẻ biểu mẫu và cập nhật các xu hướng luật lao động mới nhất.'
    },
    {
      icon: Award,
      title: 'Workshop miễn phí',
      desc: 'Được ưu tiên đăng ký tham gia các khóa đào tạo, chuyên đề nâng cao kỹ năng phỏng vấn, xây dựng thương hiệu cá nhân.'
    },
    {
      icon: UserCheck,
      title: 'Mentor nghề Recruiter',
      desc: 'Chương trình đồng hành định hướng phát triển nghề nhân sự dành cho các bạn mới vào ngành từ các chuyên gia giàu kinh nghiệm.'
    },
    {
      icon: TrendingUp,
      title: 'Xây dựng thương hiệu cá nhân',
      desc: 'Hỗ trợ các thành viên năng nổ viết bài chia sẻ chuyên môn, gia tăng tầm ảnh hưởng của bản thân trong cộng đồng nhân sự.'
    }
  ];

  const testimonials = [
    {
      quote: "Gia nhập Săn Tài Năng đã giúp tôi kết nối được với hơn 50 đối tác Headhunter uy tín trên toàn quốc. Cơ chế chia sẻ nguồn ứng viên thực sự đã cứu cánh cho chúng tôi trong mùa cao điểm tuyển dụng lập trình viên.",
      name: "Nguyễn Thị Mai Chi",
      role: "Talent Acquisition Manager tại TechVina Group",
      avatar: "MC"
    },
    {
      quote: "Chương trình Mentor Recruiter của cộng đồng rất hữu ích. Tôi đã được chị Hằng Nghĩa Thuận trực tiếp hướng dẫn kỹ năng đánh giá ứng viên cấp quản lý, nhờ đó tự tin hơn hẳn khi tham gia các buổi phỏng vấn điều hành.",
      name: "Trần Hoàng Nam",
      role: "Senior HRBP tại An Phát Holdings",
      avatar: "HN"
    },
    {
      quote: "Các buổi Offline Networking hàng tháng luôn được tổ chức rất chuyên nghiệp và thực chất. Đây không chỉ là nơi giao lưu mà thực sự là diễn đàn để các HRBP và Headhunter ngồi lại tìm tiếng nói chung.",
      name: "Phạm Minh Thư",
      role: "HR Manager tại Tập đoàn Bán lẻ VinTrade",
      avatar: "MT"
    }
  ];

  const activities = [
    { name: 'Offline Networking', desc: 'Gặp gỡ trực tiếp định kỳ hàng tháng chia sẻ cơ hội hợp tác.' },
    { name: 'Webinar', desc: 'Các chuyên đề chia sẻ trực tuyến qua Zoom về HR Tech, C&B, Luật lao động.' },
    { name: 'Workshop', desc: 'Các buổi thực hành kỹ năng phỏng vấn tuyển chọn, thiết lập AOP thực chiến.' },
    { name: 'Career Talk', desc: 'Chương trình hướng nghiệp, chia sẻ kỹ năng viết CV cho sinh viên các trường Đại học.' },
    { name: 'Company Tour', desc: 'Tham quan các doanh nghiệp tiêu biểu để trao đổi kinh nghiệm xây dựng môi trường làm việc.' }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form State
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

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
    }, 4000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Banner */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            Gia nhập cộng đồng nhân sự Việt Nam
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6 mb-6">
            Gia nhập cộng đồng <span className="gradient-gold-text">Săn Tài Năng</span>
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Học hỏi, kết nối và nâng tầm thương hiệu cá nhân cùng mạng lưới chuyên gia nhân sự chuyên nghiệp hàng đầu tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Đặc quyền gia nhập</h2>
            <h3 className="text-3xl font-black text-gray-900">Quyền lợi thành viên</h3>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/10 hover:border-[#D4AF37]/35 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-5">
                    <IconComp size={20} className="stroke-[2.5]" />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">{benefit.desc}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Slide Carousel */}
      <section className="section-padding bg-[#FDFBF7] relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Đánh giá thực tế</h2>
            <h3 className="text-3xl font-black text-gray-900">Chia sẻ từ thành viên</h3>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          {/* Testimonial card */}
          <div className="relative p-8 md:p-12 rounded-3xl bg-white border border-[#D4AF37]/15 shadow-xl">
            <span className="absolute top-6 left-8 text-5xl font-serif text-[#D4AF37]/20 leading-none pointer-events-none select-none">
              &ldquo;
            </span>
            <p className="text-sm md:text-base text-gray-700 italic leading-relaxed font-medium mb-8 relative z-10">
              {testimonials[activeTestimonial].quote}
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 border-t border-gray-100 pt-6">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full gradient-gold-bg flex items-center justify-center text-white font-extrabold text-xs shadow">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-gray-900">{testimonials[activeTestimonial].name}</span>
                  <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider">
                    {testimonials[activeTestimonial].role}
                  </span>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full border border-[#D4AF37]/20 hover:border-[#D4AF37] text-gray-700 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full border border-[#D4AF37]/20 hover:border-[#D4AF37] text-gray-700 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Activities & Register Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Activities list */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <h3 className="text-lg font-black text-gray-900 border-b border-[#D4AF37]/20 pb-3 flex items-center space-x-2">
              <Clock size={20} className="text-[#D4AF37]" />
              <span>Hoạt động cộng đồng chính</span>
            </h3>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              Mạng lưới hoạt động của chúng tôi trải dài qua nhiều chương trình chuyên môn thực chiến nhằm củng cố năng lực cho đội ngũ làm tuyển dụng tại Việt Nam.
            </p>

            <div className="space-y-4 pt-2">
              {activities.map((act, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-gray-800">{act.name}</span>
                    <span className="text-xs text-gray-500 font-semibold mt-0.5">{act.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-lg relative">
            <h3 className="text-xl font-black text-gray-900 mb-2">Đăng ký thành viên cộng đồng</h3>
            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
              Vui lòng điền thông tin để đăng ký tham gia mạng lưới Săn Tài Năng. Đội ngũ Ban quản trị sẽ rà soát thông tin và liên hệ kích hoạt tài khoản trong vòng 24h.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSuccess ? (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center flex items-center justify-center space-x-2 font-bold text-sm">
                  <CheckCircle size={18} />
                  <span>Đăng ký tham gia cộng đồng thành công! Chúng tôi đã nhận được thông tin của bạn.</span>
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
                      <label className="text-xs font-bold text-gray-700">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
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

                    {/* Years of Exp */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Số năm kinh nghiệm làm HR *</label>
                      <input
                        type="number"
                        required
                        placeholder="Ví dụ: 3"
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
                      <label className="text-xs font-bold text-gray-700">Công ty hiện tại</label>
                      <input
                        type="text"
                        placeholder="Tên công ty..."
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Chức danh công việc</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Recruiter, TA Partner..."
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
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md flex items-center justify-center space-x-2"
                  >
                    <Send size={14} />
                    <span>Đăng ký tham gia cộng đồng</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
