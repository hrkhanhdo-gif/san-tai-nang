'use client';

import Link from 'next/link';
import { 
  Search, 
  FileText, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { MotionDiv } from '@/components/motion';

export default function Services() {
  const services = [
    {
      icon: Search,
      title: 'Headhunt – Săn tài năng',
      desc: 'Tìm kiếm, đánh giá và chiêu mộ các ứng viên cấp trung, cấp cao, nhân sự chủ chốt theo yêu cầu đặc biệt của doanh nghiệp.',
      benefits: [
        'Tiếp cận tệp ứng viên bị động chất lượng',
        'Bảo mật thông tin tuyển dụng tuyệt đối',
        'Quy trình đánh giá năng lực đa chiều',
        'Bảo hành đổi ứng viên lên tới 60 ngày'
      ]
    },
    {
      icon: FileText,
      title: 'Tư vấn CV & Personal Branding',
      desc: 'Tối ưu hồ sơ năng lực cá nhân, xây dựng thương hiệu cá nhân chuyên nghiệp trên LinkedIn để thu hút nhà tuyển dụng.',
      benefits: [
        'Chuẩn hóa CV theo tiêu chuẩn quốc tế',
        'Tối ưu hóa từ khóa tìm kiếm (SEO LinkedIn)',
        'Định hình phong cách định vị bản thân',
        'Hỗ trợ luyện tập phỏng vấn thử 1-1'
      ]
    },
    {
      icon: Briefcase,
      title: 'Giới thiệu việc làm',
      desc: 'Cầu nối đáng tin cậy giúp kết nối ứng viên tài năng với những cơ hội nghề nghiệp cao cấp tại các tập đoàn đối tác.',
      benefits: [
        'Tiếp cận cơ hội việc làm ẩn (hidden jobs)',
        'Đồng hành chuẩn bị hồ sơ phỏng vấn',
        'Tư vấn deal lương và chế độ đãi ngộ',
        'Hoàn toàn miễn phí dịch vụ cho ứng viên'
      ]
    },
    {
      icon: Users,
      title: 'Workshop Nhân sự',
      desc: 'Các chuyên đề đào tạo chuyên sâu về kỹ năng phỏng vấn, xây dựng kế hoạch AOP, ứng dụng công nghệ trong tuyển dụng.',
      benefits: [
        'Kiến thức thực chiến cập nhật liên tục',
        'Diễn giả là chuyên gia HR đầu ngành',
        'Cung cấp tài liệu mẫu áp dụng được ngay',
        'Cơ hội thực hành tình huống giả định'
      ]
    },
    {
      icon: Calendar,
      title: 'Networking Event',
      desc: 'Tổ chức các sự kiện gặp gỡ giao lưu, kết nối cộng đồng nhà tuyển dụng, HRBP để hợp tác chia sẻ nguồn nhân lực.',
      benefits: [
        'Mở rộng vòng kết nối quan hệ HR chất lượng',
        'Chia sẻ nguồn ứng viên thừa/thiếu',
        'Cập nhật xu hướng tuyển dụng mới',
        'Không gian gặp gỡ sang trọng, ấm cúng'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Tư vấn chiến lược tuyển dụng',
      desc: 'Đồng hành cùng doanh nghiệp xây dựng chiến lược thu hút nhân tài dài hạn, tối ưu hóa bộ máy vận hành tuyển dụng.',
      benefits: [
        'Khảo sát và đánh giá thực trạng bộ máy',
        'Xây dựng chiến lược Employer Branding',
        'Thiết lập KPIs tuyển dụng chuẩn hóa',
        'Tối ưu chi phí tuyển chọn lên tới 40%'
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Banner */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            Giải pháp nhân sự toàn diện
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6 mb-6">
            <span className="gradient-gold-text">DỊCH VỤ TỪ CỘNG ĐỒNG SĂN TÀI NĂNG</span>
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Chúng tôi cung cấp các gói giải pháp nhân sự tùy chỉnh từ cá nhân đến doanh nghiệp lớn, đồng hành tối ưu hóa năng lực cạnh tranh và thu hút nhân tài cấp cao.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, index) => {
              const IconComp = svc.icon;
              return (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-premium p-8 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <IconComp size={24} className="stroke-[2]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#B8860B] tracking-wider uppercase bg-[#FDFBF7] border border-[#D4AF37]/20 px-2 py-0.5 rounded-md">
                        JSC Solution
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-gray-900 mb-3">{svc.title}</h3>
                    
                    {/* Description */}
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6">
                      {svc.desc}
                    </p>

                    {/* Benefits List */}
                    <ul className="space-y-3.5 mb-8">
                      {svc.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-start space-x-3">
                          <CheckCircle size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-xs font-bold text-gray-700 leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <Link
                    href="/lien-he"
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-[#FDFBF7] hover:bg-[#D4AF37]/5 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-gray-800 hover:text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    <span>Tìm hiểu thêm / Liên hệ</span>
                    <ArrowRight size={14} />
                  </Link>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Call to Action */}
      <section className="section-padding bg-[#FDFBF7] relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <HelpCircle size={40} className="text-[#D4AF37] mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Doanh nghiệp của bạn đang cần giải pháp nhân tài đặc biệt?
          </h3>
          <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Hãy liên hệ trực tiếp với Hàng Nghĩa Thuận để đặt lịch tư vấn chuyên sâu về thiết lập hệ thống tuyển dụng và săn lùng nhân sự tiềm năng cấp cao.
          </p>
          <Link
            href="/lien-he"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
          >
            <span>Yêu cầu tư vấn chiến lược</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
