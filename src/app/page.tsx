'use client';

import Link from 'next/link';
import { 
  Users, 
  Briefcase, 
  Share2, 
  UserCheck, 
  Award, 
  Network, 
  ArrowRight, 
  UserPlus
} from 'lucide-react';
import { MotionDiv, MotionH1, MotionP, MotionSpan } from '@/components/motion';

export default function Home() {
  const stats = [
    { number: '3500+', label: 'Thành viên', desc: 'Chuyên gia nhân sự toàn quốc' },
    { number: '26', label: 'Chi nhánh kết nối', desc: 'Mạng lưới HR phủ khắp tỉnh thành' },
    { number: '15+', label: 'Năm kinh nghiệm', desc: 'Hoạt động trong ngành tuyển dụng' },
    { number: '98+', label: 'Doanh nghiệp đối tác', desc: 'Ký kết hợp tác săn tài năng' },
  ];

  const benefits = [
    {
      icon: Network,
      title: 'Networking chất lượng',
      desc: 'Mở rộng mối quan hệ chuyên nghiệp với các HR Manager, Headhunter và Talent Acquisition Partner hàng đầu.',
    },
    {
      icon: Briefcase,
      title: 'Cơ hội việc làm',
      desc: 'Tiếp cận các cơ hội nghề nghiệp cấp trung và cấp cao độc quyền từ mạng lưới đối tác của Săn Tài Năng.',
    },
    {
      icon: Share2,
      title: 'Chia sẻ ứng viên',
      desc: 'Hợp tác chia sẻ nguồn lực ứng viên chất lượng cao, giúp tối ưu hóa thời gian và chi phí tuyển dụng.',
    },
    {
      icon: UserCheck,
      title: 'Thương hiệu cá nhân',
      desc: 'Tạo dựng vị thế cá nhân trong ngành nhân sự qua các hoạt động chia sẻ, viết bài và tổ chức sự kiện.',
    },
    {
      icon: Award,
      title: 'Workshop chuyên môn',
      desc: 'Tham gia các buổi đào tạo chuyên sâu về kỹ năng phỏng vấn, xây dựng AOP và xu hướng HR Tech mới nhất.',
    },
    {
      icon: Users,
      title: 'Kết nối doanh nghiệp',
      desc: 'Cầu nối uy tín giúp doanh nghiệp nhanh chóng giải quyết bài toán thiếu hụt nhân tài cấp cao.',
    },
  ];

  const activities = [
    {
      title: 'Networking Event',
      time: 'Định kỳ Hàng tháng',
      desc: 'Gặp gỡ trực tiếp trao đổi cơ hội hợp tác tuyển dụng và chia sẻ tệp ứng viên chất lượng.',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Workshop Nhân sự',
      time: '2 lần / Quý',
      desc: 'Đào tạo kỹ năng chuyên sâu từ lập kế hoạch AOP đến xây dựng thương hiệu nhà tuyển dụng.',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Career Talk',
      time: 'Định kỳ Hàng quý',
      desc: 'Các buổi chia sẻ định hướng nghề nghiệp, kỹ năng phỏng vấn thực tế cho sinh viên các trường Đại học.',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Mentor Recruiter',
      time: 'Học tập liên tục',
      desc: 'Chương trình cố vấn 1-1 hỗ trợ các bạn trẻ định hướng và phát triển sự nghiệp trong ngành tuyển dụng.',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'HR Community Meetup',
      time: 'Thường niên',
      desc: 'Đại hội gắn kết cộng đồng nhân sự Việt Nam với sự tham gia của hơn 500+ khách mời.',
      image: '/api/placeholder/400/300'
    },
    {
      title: 'Talent Sharing',
      time: 'Hoạt động hàng ngày',
      desc: 'Diễn đàn chia sẻ CV ứng viên tiềm năng và hỗ trợ kết nối việc làm nhanh chóng.',
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5">
        {/* Soft golden light balls background decorative elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/10 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          {/* Badge */}
          <MotionDiv 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#B8860B] font-bold text-xs uppercase tracking-wider mb-8"
          >
            <Award size={14} className="text-[#D4AF37]" />
            <span>Cộng đồng Recruiter hàng đầu Việt Nam</span>
          </MotionDiv>

          {/* Title */}
          <MotionH1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6"
          >
            Kết nối nhân tài <br />
            <MotionSpan className="gradient-gold-text">Mở rộng cơ hội nghề nghiệp</MotionSpan>
          </MotionH1>

          {/* Description */}
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Cộng đồng dành riêng cho Recruiter, Headhunter và chuyên gia nhân sự trên toàn quốc. Nơi kết nối, học hỏi, chia sẻ cơ hội nghề nghiệp và phát triển sự nghiệp bền vững.
          </MotionP>

          {/* CTA Buttons */}
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20"
          >
            <Link 
              href="/tham-gia-ngay" 
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-sm uppercase tracking-wider gradient-gold-bg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <UserPlus size={16} />
              <span>Tham gia cộng đồng</span>
            </Link>
            <Link 
              href="/viec-lam" 
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-full text-gray-800 font-bold text-sm uppercase tracking-wider bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <Briefcase size={16} className="text-[#D4AF37]" />
              <span>Xem việc làm</span>
            </Link>
          </MotionDiv>

          {/* Dynamic Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto pt-10 border-t border-[#D4AF37]/10">
            {stats.map((stat, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex flex-col items-center text-center"
              >
                <span className="text-3xl md:text-4xl font-black text-[#D4AF37] mb-2">
                  {stat.number}
                </span>
                <span className="text-sm font-bold text-gray-900 mb-1">
                  {stat.label}
                </span>
                <span className="text-xs text-gray-500 leading-normal">
                  {stat.desc}
                </span>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="section-padding bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Quyền lợi đặc quyền</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900">
              Vì sao nên tham gia <span className="gradient-gold-text">Săn Tài Năng</span>?
            </h3>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-premium p-8 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6">
                    <IconComp size={24} className="stroke-[2]" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium flex-grow">{benefit.desc}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Activities Section (Timeline & Gallery) */}
      <section className="section-padding bg-[#FDFBF7] relative">
        {/* Top glow border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Lịch trình & Hoạt động</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900">
              Hoạt động nổi bật
            </h3>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          {/* Timeline and Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#D4AF37]/20">
              {activities.map((act, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-6 relative pl-10 md:pl-12"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 w-4 h-4 rounded-full bg-[#D4AF37] border-4 border-white shadow-md flex-shrink-0 z-10" />
                  
                  <div className="p-6 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex-grow hover:border-[#D4AF37]/35 transition-colors">
                    <span className="inline-block text-[10px] font-extrabold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-2.5 py-1 rounded-md mb-3">
                      {act.time}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{act.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{act.desc}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Premium Gold/White Gallery */}
            <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-24">
              {/* Photo Card 1 */}
              <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex flex-col space-y-4 hover:border-[#D4AF37]/35 transition-all">
                <div className="aspect-[4/3] rounded-xl gradient-gold-bg flex items-center justify-center text-white font-black text-center p-3 text-sm">
                  Connecting Talent HR Expo
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#B8860B] font-bold">EVENT</span>
                  <span className="text-sm font-bold text-gray-900">Offline Networking</span>
                </div>
              </div>

              {/* Photo Card 2 */}
              <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex flex-col space-y-4 hover:border-[#D4AF37]/35 transition-all mt-6">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#E6C687] to-[#D4AF37] flex items-center justify-center text-white font-black text-center p-3 text-sm">
                  HRBP Workshop Series
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#B8860B] font-bold">ACADEMY</span>
                  <span className="text-sm font-bold text-gray-900">Workshop Nhân sự</span>
                </div>
              </div>

              {/* Photo Card 3 */}
              <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex flex-col space-y-4 hover:border-[#D4AF37]/35 transition-all -mt-6">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-black text-center p-3 text-sm">
                  University Career Path
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#B8860B] font-bold">SHARING</span>
                  <span className="text-sm font-bold text-gray-900">Career Guidance Talk</span>
                </div>
              </div>

              {/* Photo Card 4 */}
              <div className="p-4 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex flex-col space-y-4 hover:border-[#D4AF37]/35 transition-all">
                <div className="aspect-[4/3] rounded-xl gradient-gold-bg flex items-center justify-center text-white font-black text-center p-3 text-sm">
                  Recruiter 1-ON-1 Mentor
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#B8860B] font-bold">COACHING</span>
                  <span className="text-sm font-bold text-gray-900">Mentor Recruiter Program</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Bắt đầu hành trình kết nối và <br />
            phát triển <span className="gradient-gold-text">sự nghiệp nhân sự</span> ngay hôm nay
          </h3>
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            Trở thành một phần trong cộng đồng hơn 3500+ Recruiter và các chuyên gia nhân sự hàng đầu tại Việt Nam để tiếp cận các cơ hội hợp tác chất lượng.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/tham-gia-ngay"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold text-sm uppercase tracking-wider gradient-gold-bg shadow-xl hover:scale-[1.03] transition-transform duration-300"
            >
              <span>Đăng ký tham gia ngay</span>
              <ArrowRight size={16} />
            </Link>
            <Link 
              href="/lien-he"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-full text-gray-800 font-bold text-sm uppercase tracking-wider bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-sm hover:bg-gray-50 transition-all duration-300"
            >
              <span>Liên hệ hợp tác</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
