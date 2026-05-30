'use client';

import { 
  Briefcase, 
  Award, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  CheckCircle
} from 'lucide-react';
import { MotionDiv } from '@/components/motion';

export default function About() {
  const achievements = [
    { value: '98+', label: 'Doanh nghiệp đối tác', desc: 'Hợp tác tuyển chọn nhân sự đa ngành' },
    { value: '3000+', label: 'Ứng viên đã phỏng vấn', desc: 'Đánh giá năng lực chuyên sâu' },
    { value: '452+', label: 'Ứng viên tuyển thành công', desc: 'Gia nhập các doanh nghiệp lớn' },
    { value: '40+', label: 'Headhunter được đào tạo', desc: 'Cung cấp nhân lực cho thị trường' },
    { value: '20+', label: 'Trường Đại học hợp tác', desc: 'Liên kết hướng nghiệp tuyển dụng' },
    { value: '20+', label: 'Chương trình hướng nghiệp', desc: 'Chia sẻ kỹ năng thực tế cho SV' },
  ];

  const timeline = [
    {
      period: '09/2018 - ĐẾN NAY',
      company: 'CÔNG TY TNHH JOB SERVICE CONNECT',
      role: 'Giám đốc điều hành (CEO)',
      details: 'Lĩnh vực: Headhunt - Tuyển dụng Nhân sự Tài năng. Quy mô: 20 nhân viên.',
      tasks: [
        'Điều hành, quản lý toàn diện các hoạt động của công ty: Tài chính, Nhân sự, Pháp lý, Kinh doanh và Marketing.',
        'Xây dựng và triển khai chiến lược kinh doanh trung và dài hạn cho doanh nghiệp.',
        'Trực tiếp thực hiện các nghiệp vụ đối ngoại, săn lùng ứng viên quản lý cấp trung, cấp cao theo đơn đặt hàng.',
        'Tổ chức đào tạo nội bộ chuyên môn săn tin, thẩm định và đánh giá ứng viên.',
        'Tư vấn trực tiếp cho Ban Giám đốc các doanh nghiệp đối tác về chiến lược tối ưu hóa nguồn lực nhân sự.'
      ],
      results: [
        'Đã ký kết và thực hiện dịch vụ Headhunt thành công cho 98 Doanh nghiệp đa ngành.',
        'Tiến cử thành công 452 ứng viên nhân sự cao cấp gia nhập các tổ chức lớn.',
        'Trực tiếp đào tạo và huấn luyện 40 chuyên viên săn tài năng đạt chuẩn.',
        'Kết nối hợp tác với 20 trường Đại học, thực hiện hơn 20 chương trình hướng nghiệp chuyên sâu cho sinh viên.'
      ]
    },
    {
      period: '09/2010 - 08/2018',
      company: 'ĐỒNG TÂM GROUP',
      role: 'Quản lý Tuyển dụng và Thu hút tài năng',
      details: 'Lĩnh vực: Sản xuất và thương mại Vật liệu xây dựng. Quy mô: 3.500 nhân sự toàn hệ thống với 26 Chi nhánh và 15 Công ty thành viên.',
      tasks: [
        'Xây dựng và triển khai toàn bộ quy trình, chính sách, hệ thống đánh giá năng lực ứng viên trên toàn quốc.',
        'Nghiên cứu thị trường lao động để lập kế hoạch chiến lược thu hút nhân tài trung và cao cấp.',
        'Thiết lập mối quan hệ với các trường đại học, liên đoàn lao động các tỉnh và các trung tâm giới thiệu việc làm.',
        'Được chọn tham gia chương trình đào tạo "Lực lượng kế thừa", kiêm nhiệm quản trị mảng Đào tạo, Chính sách, Hành chính và Mua hàng.'
      ],
      results: [
        'Tập thể đáp ứng xuất sắc trên 70% nhu cầu tuyển dụng thường xuyên của toàn bộ tập đoàn.',
        'Thu hút thành công gần 50 nhân sự tài năng vào vị trí quản lý và điều hành chủ chốt.',
        'Tối ưu hóa ngân sách tuyển dụng lên tới 40% nhờ cải tiến quy trình và kênh tạo nguồn tự nhiên.'
      ]
    },
    {
      period: '09/2009 - 07/2010',
      company: 'VĂN PHÒNG CHÍNH PHỦ - PHÍA NAM',
      role: 'Chuyên viên phòng Quản trị',
      details: 'Cơ quan quản lý hành chính Nhà nước cấp cao. Quy mô đơn vị: 120 nhân sự.',
      tasks: [
        'Đón tiếp, sắp xếp hậu cần và tháp tùng lãnh đạo Văn phòng Chính phủ đi công tác tại các tỉnh thành phía Nam.',
        'Điều phối kế hoạch di chuyển hàng không, ăn nghỉ, phương tiện bảo mật an ninh theo đúng quy chuẩn Nhà nước.',
        'Đảm nhận công tác lễ tân đối ngoại cấp cao, tiếp nhận công văn và xử lý văn bản hành chính công.',
        'Phối hợp với lực lượng Cảnh vệ Quốc gia đảm bảo tuyệt đối an ninh trong các hành trình công vụ.'
      ],
      results: [
        'Hoàn thành 100% các chuyến công vụ an toàn tuyệt đối và đạt hiệu quả hành chính cao.',
        'Tham gia lớp bồi dưỡng lý luận và nhận thức sâu sắc về Đảng.'
      ]
    }
  ];

  const educations = [
    {
      title: 'Học viện Hành chính Quốc gia - TP.HCM',
      time: '2004 - 2008',
      desc: 'Cử nhân Hành chính - Chuyên ngành Quản lý Hành chính công.'
    }
  ];

  const certificates = [
    'Quản trị nhân sự theo tiêu chuẩn Quốc tế - HR International Resources',
    'Kỹ năng phỏng vấn Tuyển dụng chuyên nghiệp - PTI Recruitment Interview',
    'Giám đốc điều hành chuyên nghiệp - PACE CEO',
    'Kỹ năng bán hàng chuyên nghiệp - PTI Sales Skills',
    'Xây dựng kế hoạch AOP - Thiết lập mục tiêu hoạt động & kế hoạch kinh doanh',
    'Chương trình đào tạo lực lượng kế thừa phát triển toàn diện - Đồng Tâm Group',
    'Dự án cải tiến năng lực làm việc & tối ưu hiệu quả nhân viên - Đồng Tâm Group'
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Profile Intro Section */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Image Box (Left) - Kept blank but styled luxuriously */}
          <MotionDiv 
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-3xl border-2 border-[#D4AF37]/30 bg-[#FDFBF7] flex flex-col items-center justify-center p-8 shadow-xl overflow-hidden group">
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFC107]/20 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-tr-full" />
              
              {/* Decorative gold lines */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-2xl border border-dashed border-[#D4AF37]/20 pointer-events-none" />

              {/* Monogram placeholder */}
              <div className="w-28 h-28 rounded-full gradient-gold-bg flex items-center justify-center text-white font-extrabold text-3xl shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300">
                HNT
              </div>
              
              <h3 className="text-xl font-black text-gray-900 tracking-wide text-center">HẰNG NGHĨA THUẬN</h3>
              <p className="text-xs text-[#B8860B] font-bold tracking-widest uppercase text-center mt-2">
                Talent Acquisition Partner
              </p>
              <div className="w-10 h-0.5 bg-[#D4AF37] my-4" />
              
              {/* Fast Contact Card */}
              <div className="w-full bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-[#D4AF37]/10 space-y-2 text-xs font-semibold text-gray-700">
                <div className="flex items-center space-x-2.5">
                  <MapPin size={14} className="text-[#D4AF37]" />
                  <span>KDC Lê Thành, An Lạc, TP.HCM</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone size={14} className="text-[#D4AF37]" />
                  <a href="tel:+84986162568" className="hover:text-[#D4AF37] transition-colors">+84 98 61 62 568</a>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail size={14} className="text-[#D4AF37]" />
                  <a href="mailto:ttg.thuanhn@gmail.com" className="hover:text-[#D4AF37] transition-colors">ttg.thuanhn@gmail.com</a>
                </div>
              </div>
            </div>
          </MotionDiv>

          {/* Profile details (Right) */}
          <MotionDiv 
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest">Người sáng lập cộng đồng</span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              Hằng Nghĩa Thuận
            </h1>
            <h2 className="text-lg md:text-xl font-bold text-[#D4AF37] -mt-3">
              Talent Acquisition & Recruitment Partner
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mb-4" />

            <p className="text-base text-gray-700 leading-relaxed font-semibold">
              Hơn 15 năm kinh nghiệm trong lĩnh vực tuyển dụng và thu hút tài năng cho các doanh nghiệp đa ngành trong và ngoài nước.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Tôi có thế mạnh chuyên sâu trong việc hoạch định chiến lược nhân lực toàn diện, thiết kế quy chuẩn phỏng vấn và trực tiếp săn lùng các ứng viên cấp trung, cấp cao, nhân sự chủ chốt cho doanh nghiệp. 
            </p>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Từng chịu trách nhiệm triển khai hệ thống tuyển dụng cho tập đoàn sản xuất - dịch vụ quy mô lớn hơn 3.500 nhân sự và 26 chi nhánh toàn quốc, tôi luôn hướng tới triết lý: <strong>Nhân sự là đối tác chiến lược đồng hành</strong> cùng sự phát triển bền vững của doanh nghiệp.
            </p>

            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/15 flex items-start space-x-4">
              <Building className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={24} />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Doanh nghiệp đang điều hành</span>
                <span className="text-base font-black text-gray-800 tracking-wide">JOB SERVICE CONNECT</span>
                <span className="text-xs text-gray-500 font-semibold mt-1">
                  Đơn vị uy tín trong mảng Headhunt, cung ứng nhân lực cấp cao và tư vấn xây dựng chính sách thu hút tài năng.
                </span>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Accomplishments Numbers */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Thống kê thành tựu</h3>
            <h4 className="text-3xl font-black text-gray-900">Kết quả hoạt động thực tế</h4>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/10 flex flex-col hover:border-[#D4AF37]/30 transition-colors shadow-sm"
              >
                <span className="text-3xl font-black text-[#D4AF37] mb-2">{item.value}</span>
                <span className="text-sm font-bold text-gray-900 mb-1">{item.label}</span>
                <span className="text-xs text-gray-500 font-semibold leading-relaxed">{item.desc}</span>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="section-padding bg-[#FDFBF7] relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-xs font-bold text-[#B8860B] uppercase tracking-widest mb-3">Hành trình nghề nghiệp</h3>
            <h4 className="text-3xl font-black text-gray-900">Kinh nghiệm làm việc chi tiết</h4>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          <div className="relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#D4AF37]/20">
            {timeline.map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative pl-12 md:pl-16 mb-16 last:mb-0"
              >
                {/* Bullet */}
                <div className="absolute left-[19px] top-1.5 w-6 h-6 rounded-full bg-[#D4AF37] border-4 border-white shadow flex-shrink-0 z-10" />

                <div className="p-8 rounded-3xl bg-white border border-[#D4AF37]/10 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-5">
                    <div>
                      <span className="inline-block text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2.5 py-1 rounded-md mb-2">
                        {item.period}
                      </span>
                      <h4 className="text-xl md:text-2xl font-black text-gray-900">{item.company}</h4>
                    </div>
                    <span className="text-sm font-bold text-[#D4AF37] mt-2 md:mt-0">{item.role}</span>
                  </div>

                  <p className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building size={12} />
                    <span>{item.details}</span>
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    {/* Responsibilities */}
                    <div>
                      <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center space-x-2">
                        <Briefcase size={16} className="text-[#D4AF37]" />
                        <span>Trách nhiệm công việc</span>
                      </h5>
                      <ul className="space-y-2 text-xs font-semibold text-gray-600">
                        {item.tasks.map((task, tIndex) => (
                          <li key={tIndex} className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 mr-2.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Results */}
                    <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/15">
                      <h5 className="text-sm font-bold text-[#B8860B] uppercase tracking-wide mb-3 flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span>Kết quả đạt được</span>
                      </h5>
                      <ul className="space-y-2.5 text-xs font-bold text-gray-700">
                        {item.results.map((res, rIndex) => (
                          <li key={rIndex} className="flex items-start">
                            <span className="text-[#D4AF37] font-black mr-2">✓</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Certificates */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Education */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <h4 className="text-sm font-bold text-[#B8860B] uppercase tracking-widest flex items-center space-x-2">
              <GraduationCap size={18} />
              <span>Học vấn & Đào tạo chính quy</span>
            </h4>
            <div className="w-12 h-0.5 bg-[#D4AF37]" />

            <div className="space-y-6 mt-4">
              {educations.map((edu, index) => (
                <div key={index} className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/10 shadow-sm relative overflow-hidden">
                  <span className="text-[10px] font-extrabold text-[#B8860B] tracking-wider uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                    {edu.time}
                  </span>
                  <h5 className="text-base font-black text-gray-900 mt-3">{edu.title}</h5>
                  <p className="text-xs text-gray-600 font-semibold mt-2 leading-relaxed">{edu.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h4 className="text-sm font-bold text-[#B8860B] uppercase tracking-widest flex items-center space-x-2">
              <Award size={18} />
              <span>Chứng chỉ & Đào tạo nâng cao</span>
            </h4>
            <div className="w-12 h-0.5 bg-[#D4AF37]" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {certificates.map((cert, index) => (
                <div key={index} className="p-4 rounded-xl bg-white border border-[#D4AF37]/10 flex items-start space-x-3 hover:border-[#D4AF37]/30 transition-colors">
                  <CheckCircle size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-gray-700 leading-relaxed">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
