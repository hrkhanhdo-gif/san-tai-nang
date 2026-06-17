'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Briefcase, 
  Share2, 
  UserCheck, 
  Award, 
  Network, 
  ArrowRight
} from 'lucide-react';
import { MotionDiv } from '@/components/motion';
import { dbHelper, CommunityActivity } from '@/lib/supabase';

const emojiMap: Record<string, string> = {
  books: '📚',
  handshake: '🤝',
  briefcase: '💼',
  target: '🎯',
  party: '🎉',
  coffee: '☕'
};

export default function Home() {

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

  const [activitiesList, setActivitiesList] = useState<CommunityActivity[]>([]);

  useEffect(() => {
    async function load() {
      const all = await dbHelper.getActivities();
      const featured = all.filter(act => act.showOnHomepage);
      setActivitiesList(featured);
    }
    load();
  }, []);

  return (
    <div className="bg-white">
      {/* Banner Section */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="w-full h-64 md:h-[400px] rounded-3xl bg-white border-2 border-dashed border-[#D4AF37]/40 flex items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FDFBF7] to-white opacity-60" />
          <div className="space-y-3 relative z-10 p-6">
            <span className="text-2xl md:text-3xl font-black text-[#B8860B] uppercase tracking-wider block">
              Khu vực chứa hình ảnh banner
            </span>
            <p className="text-xs text-gray-500 font-bold block max-w-md mx-auto leading-relaxed">
              (Thư mục gốc sẽ hiển thị banner hình ảnh tại đây sau khi cập nhật tệp ảnh)
            </p>
          </div>
        </div>
      </section>

      {/* Lời chia sẻ từ Ban Sáng lập */}
      <section className="bg-[#FDFBF7] relative py-16 border-t border-b border-[#D4AF37]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Ban Sáng Lập</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900">
              Lời chia sẻ từ <span className="gradient-gold-text">Nhà sáng lập</span>
            </h3>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Người 1: Anh Hàng Nghĩa Thuận */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-3xl border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-6xl text-[#D4AF37]/10 font-serif pointer-events-none select-none">“</div>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-inner mb-6 flex-shrink-0">
                <img
                  src="/thuan-hn.jpg"
                  alt="Anh Hàng Nghĩa Thuận"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-1">Hàng Nghĩa Thuận</h4>
              <span className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider block">
                Co-Founder & CEO - Job Service
              </span>
              <span className="text-[10px] font-semibold text-gray-400 block mb-4">
                Founder Cộng đồng Săn Tài Năng
              </span>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed italic mt-2">
                &quot;Săn Tài Năng ra đời với khao khát kết nối hàng ngàn chuyên gia nhân sự và headhunter hàng đầu tại Việt Nam. Chúng tôi tin rằng khi tri thức và cơ hội được sẻ chia rộng rãi, cộng đồng sẽ cùng nhau bứt phá và kiến tạo các giá trị nhân sự bền vững cho doanh nghiệp.&quot;
              </p>
            </MotionDiv>

            {/* Người 2: Anh Nguyễn Văn A */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-6xl text-[#D4AF37]/10 font-serif pointer-events-none select-none">“</div>
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/20 flex items-center justify-center text-[#B8860B] font-black text-2xl shadow-inner mb-6 flex-shrink-0">
                NVA
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-1">Nguyễn Văn A</h4>
              <span className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider block">
                Co-Founder
              </span>
              <span className="text-[10px] font-semibold text-gray-400 block mb-4">
                HRM Công ty...................
              </span>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed italic mt-2">
                &quot;Hợp tác chia sẻ ứng viên và chia sẻ kinh nghiệm là chìa khóa vàng giúp nhà tuyển dụng tối ưu hóa chi phí và thời gian. Cộng đồng Săn Tài Năng chính là bệ phóng giúp các Recruiter nâng cao vị thế và chia sẻ những bài học thực chiến giá trị.&quot;
              </p>
            </MotionDiv>

            {/* Người 3: Anh Trần Văn B */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-[#D4AF37]/15 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-6 text-6xl text-[#D4AF37]/10 font-serif pointer-events-none select-none">“</div>
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37]/20 flex items-center justify-center text-[#B8860B] font-black text-2xl shadow-inner mb-6 flex-shrink-0">
                TVB
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-1">Trần Văn B</h4>
              <span className="text-[11px] font-bold text-[#B8860B] uppercase tracking-wider block">
                Co-Founder
              </span>
              <span className="text-[10px] font-semibold text-gray-400 block mb-4">
                .......................
              </span>
              <p className="text-xs font-semibold text-gray-600 leading-relaxed italic mt-2">
                &quot;Kiến tạo một hệ sinh thái kết nối nhân tài minh bạch, uy tín và hiệu quả là mục tiêu hàng đầu của chúng tôi. Tại đây, mỗi Headhunter đều tìm thấy những đối tác chiến lược tin cậy, thúc đẩy doanh số và khẳng định năng lực cá nhân.&quot;
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="bg-white relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Quyền lợi đặc quyền</h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900">
              Vì sao nên tham gia <span className="gradient-gold-text">Săn Tài Năng</span>?
            </h3>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit, index) => {
              const IconComp = benefit.icon;
              return (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="card-premium p-5 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 border border-[#D4AF37]/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4 flex-shrink-0">
                    <IconComp size={20} className="stroke-[2]" />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 mb-2 leading-snug min-h-[40px] flex items-center justify-center">{benefit.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-semibold flex-grow">{benefit.desc}</p>
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
          {activitiesList.length === 0 ? (
            <div className="text-center py-16 px-6 max-w-xl mx-auto rounded-3xl border border-dashed border-[#D4AF37]/25 bg-white shadow-sm">
              <span className="text-4xl block mb-4">🌟</span>
              <h4 className="text-base font-black text-gray-900 mb-2">Chưa có hoạt động nổi bật nào được chọn hiển thị</h4>
              <p className="text-xs text-[#B8860B] font-bold tracking-wider uppercase mb-2">Thông tin cập nhật liên tục</p>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-6">
                Ban quản trị cộng đồng chưa lựa chọn hoạt động nổi bật nào để ghim lên Trang chủ. Bạn có thể xem toàn bộ các hoạt động, sự kiện đang diễn ra tại trang Hoạt động.
              </p>
              <Link
                href="/hoat-dong"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md hover:scale-[1.03] transition-transform duration-300"
              >
                <span>Xem trang hoạt động</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Timeline */}
              <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#D4AF37]/20">
                {activitiesList.map((act, index) => (
                  <MotionDiv
                    key={act.id}
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
                        {act.date || 'Đang diễn ra'}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{act.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-3">{act.description}</p>
                    </div>
                  </MotionDiv>
                ))}
              </div>

              {/* Premium Gold/White Gallery */}
              <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-24">
                {activitiesList.slice(0, 4).map((act, index) => {
                  const hasImage = act.images && act.images.length > 0;
                  const emoji = emojiMap[act.imageType || 'books'] || '📚';
                  
                  // Staggered layout spacing
                  const spacingClass = index === 1 ? 'mt-6' : index === 2 ? '-mt-6' : '';
                  
                  return (
                    <div 
                      key={act.id}
                      className={`p-4 rounded-2xl bg-white border border-[#D4AF37]/10 shadow-sm flex flex-col space-y-4 hover:border-[#D4AF37]/35 transition-all ${spacingClass}`}
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#FDFBF7] to-[#D4AF37]/10 border border-[#D4AF37]/10 flex items-center justify-center text-white font-black text-center p-3 text-sm relative">
                        {hasImage ? (
                          <img 
                            src={act.images![0]} 
                            alt={act.title} 
                            className="w-full h-full object-cover absolute inset-0"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <span className="text-3xl">{emoji}</span>
                            <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-wider">{act.category}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#B8860B] font-bold uppercase">{act.category}</span>
                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{act.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
