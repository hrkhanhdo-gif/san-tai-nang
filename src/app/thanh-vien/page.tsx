'use client';

import { useState, useEffect } from 'react';
import { 
  Award, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { dbHelper, OrgMember, HonoredMember } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

export default function MembersPage() {
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [honoredMembers, setHonoredMembers] = useState<HonoredMember[]>([]);
  
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadData() {
      const orgData = await dbHelper.getOrgMembers();
      setOrgMembers(orgData);

      const honoredData = await dbHelper.getHonoredMembers();
      setHonoredMembers(honoredData);
    }
    loadData();
  }, []);

  // Carousel autoplay every 10s
  useEffect(() => {
    if (honoredMembers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % honoredMembers.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [honoredMembers.length]);

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + honoredMembers.length) % honoredMembers.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % honoredMembers.length);
  };

  // Helper to generate initials for avatar placeholder
  const getInitials = (name: string) => {
    if (!name) return 'STN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="py-20 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-gray-100 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
              Thành viên cộng đồng
            </span>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              KẾT NỐI &amp; HỢP TÁC <br />
              <span className="gradient-gold-text">SĂN TÀI NĂNG</span>
            </h1>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-sm text-gray-500 font-semibold max-w-2xl mx-auto leading-relaxed"
          >
            Nơi hội tụ của các Headhunter, Chuyên viên tuyển dụng (TA) và Nhà quản lý nhân sự chuyên nghiệp, chung sức kết nối cơ hội nghề nghiệp cấp cao.
          </MotionDiv>
        </div>
      </section>

      {/* Sơ đồ cơ cấu tổ chức */}
      <section className="py-20 bg-white border-b border-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
              Ban Điều Hành
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-4">Cơ cấu tổ chức Thành viên</h2>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          {/* Org Chart 4-Tiers */}
          <div className="flex flex-col items-center justify-center relative py-6">
            
            {/* Tier 1: Founder / Co-Founder */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {orgMembers.filter(m => m.roleType === 'founder').map((m) => (
                <MotionDiv
                  key={m.id}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF9E6] to-[#B8860B] shadow-lg">
                    <img
                      src={m.image || '/thuan-hn.jpg'}
                      alt={m.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-inner"
                    />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#B8860B] text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-widest whitespace-nowrap">
                      FOUNDER / CO-FOUNDER
                    </span>
                  </div>
                  <div className="mt-5 bg-white border border-[#D4AF37]/20 rounded-2xl p-5 shadow-sm max-w-xs transition-all hover:scale-105 hover:border-[#D4AF37]/50 duration-300 text-center">
                    <h4 className="text-base font-black text-gray-900">{m.name}</h4>
                    <p className="text-[10px] text-[#B8860B] font-bold uppercase tracking-wider mt-0.5">{m.company}</p>
                    <div className="w-8 h-[1px] bg-[#D4AF37]/20 mx-auto my-2.5" />
                    <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                      {m.role}
                    </p>
                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Connecting Line 1 (Founders to Admins) */}
            {orgMembers.filter(m => m.roleType === 'admin').length > 0 && (
              <div className="w-[3px] h-12 bg-gradient-to-b from-[#D4AF37] to-amber-500 my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-sm" />
              </div>
            )}

            {/* Tier 2: Thư ký / Admin */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {orgMembers.filter(m => m.roleType === 'admin').map((m) => (
                <MotionDiv
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-500 via-amber-200 to-amber-600 shadow-md">
                    <img
                      src={m.image || '/nguyen-thi-c.png'}
                      alt={m.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-inner"
                    />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider whitespace-nowrap">
                      THƯ KÝ / ADMIN
                    </span>
                  </div>
                  <div className="mt-5 bg-white border border-amber-200 rounded-2xl p-5 shadow-sm max-w-xs transition-all hover:scale-105 hover:border-amber-300 duration-300 text-center">
                    <h4 className="text-sm font-black text-gray-900">{m.name}</h4>
                    <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">{m.company}</p>
                    <div className="w-8 h-[1px] bg-amber-100 mx-auto my-2.5" />
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {m.role}
                    </p>
                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Connecting Line 2 (Admins to Leaders) */}
            {orgMembers.filter(m => m.roleType === 'leader').length > 0 && (
              <div className="w-[3px] h-12 bg-gradient-to-b from-amber-500 to-[#CD7F32] my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#CD7F32] rounded-full shadow-sm" />
              </div>
            )}

            {/* Tier 3: Trưởng Ban */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {orgMembers.filter(m => m.roleType === 'leader').map((m) => (
                <MotionDiv
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#CD7F32] via-[#F5D6B8] to-[#995C24] shadow-md">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-inner"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#CD7F32]/10 border-4 border-white shadow-inner flex items-center justify-center text-[#995C24] font-black text-lg">
                        {getInitials(m.name)}
                      </div>
                    )}
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#995C24] text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider whitespace-nowrap">
                      TRƯỞNG BAN
                    </span>
                  </div>
                  <div className="mt-5 bg-white border border-[#CD7F32]/25 rounded-2xl p-5 shadow-sm max-w-xs transition-all hover:scale-105 hover:border-[#CD7F32]/50 duration-300 text-center">
                    <h4 className="text-sm font-black text-gray-900">{m.name}</h4>
                    <p className="text-[9px] text-[#CD7F32] font-bold uppercase tracking-wider mt-0.5">{m.company}</p>
                    <div className="w-8 h-[1px] bg-[#CD7F32]/10 mx-auto my-2.5" />
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {m.role}
                    </p>
                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Connecting Line 3 (Leaders to Members) */}
            {orgMembers.filter(m => m.roleType === 'member').length > 0 && (
              <div className="w-[3px] h-12 bg-gradient-to-b from-[#CD7F32] to-gray-200 my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#CD7F32] rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-200 rounded-full shadow-sm" />
              </div>
            )}

            {/* Tier 4: Thành viên */}
            {orgMembers.filter(m => m.roleType === 'member').length > 0 && (
              <div className="max-w-6xl w-full mx-auto px-6 mt-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                  {orgMembers.filter(m => m.roleType === 'member').map((m) => (
                    <MotionDiv
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="bg-white border border-gray-250 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center duration-300"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 mb-4 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#D4AF37]/10 text-[#B8860B] font-bold text-sm">
                            {getInitials(m.name)}
                          </div>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-gray-900">{m.name}</h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                        Thành viên
                      </span>
                      <span className="text-[9px] text-[#B8860B] font-bold block mb-3 uppercase">
                        {m.company}
                      </span>
                      <p className="text-xs text-gray-600 font-semibold leading-relaxed mt-1 line-clamp-3">
                        {m.role}
                      </p>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Bảng vàng danh dự (Carousel) */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FDFBF7]/50 border-b border-gray-100 relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
              Bảng Vàng Danh Dự
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-4">Vinh danh thành viên nổi bật</h2>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
            <p className="text-xs text-gray-500 font-semibold mt-4">
              Ghi nhận những đóng góp xuất sắc, tinh thần cống hiến vì sự phát triển chung của cộng đồng.
            </p>
          </div>

          {honoredMembers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 max-w-md mx-auto">
              <Award className="text-gray-300 mx-auto mb-3" size={32} />
              <p className="text-xs text-gray-400 font-semibold">Chưa có hình ảnh vinh danh nào được cập nhật.</p>
            </div>
          ) : (
            <div className="relative max-w-4xl mx-auto group">
              {/* Large Display Carousel */}
              <div className="relative overflow-hidden rounded-3xl bg-white border border-[#D4AF37]/20 shadow-xl aspect-[16/9] md:h-[500px] flex items-center justify-center p-3">
                {honoredMembers.map((m, index) => (
                  <div
                    key={m.id}
                    className={`absolute inset-3 transition-opacity duration-700 flex items-center justify-center ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <div 
                      onClick={() => setLightboxImage(m.image)}
                      className="w-full h-full relative overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center cursor-pointer group/item"
                    >
                      <img
                        src={m.image}
                        alt={`Honored Member ${index + 1}`}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover/item:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-black uppercase tracking-wider bg-[#B8860B]/90 px-5 py-2.5 rounded-xl shadow-lg border border-[#D4AF37]/30 backdrop-blur-sm">
                          Xem phóng to (Lightbox)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev/Next Buttons */}
              {honoredMembers.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-800 hover:text-[#B8860B] border border-gray-150 flex items-center justify-center transition-all shadow-md md:opacity-0 md:group-hover:opacity-100 focus:outline-none"
                    title="Ảnh trước"
                  >
                    <ChevronLeft size={24} className="stroke-[2.5]" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/80 hover:bg-white text-gray-800 hover:text-[#B8860B] border border-gray-150 flex items-center justify-center transition-all shadow-md md:opacity-0 md:group-hover:opacity-100 focus:outline-none"
                    title="Ảnh tiếp theo"
                  >
                    <ChevronRight size={24} className="stroke-[2.5]" />
                  </button>
                </>
              )}

              {/* Dots Indicators */}
              {honoredMembers.length > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {honoredMembers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-[#D4AF37] w-6' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      title={`Đến trang ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox view modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            type="button" 
            className="absolute top-6 right-6 text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img 
              src={lightboxImage} 
              alt="Zoomed Honored Certificate" 
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
