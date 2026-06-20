'use client';

import { useState, useEffect } from 'react';
import { 
  Award, X, ChevronLeft, ChevronRight, Send, CheckCircle 
} from 'lucide-react';
import { dbHelper, OrgMember, HonoredMember } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

const LinkedinIcon = ({ size = 24, ...props }: { size?: number; className?: string }) => (
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

export default function MembersPage() {
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [honoredMembers, setHonoredMembers] = useState<HonoredMember[]>([]);
  
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form registration state
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

  const founders = orgMembers.filter(m => m.roleType === 'founder');
  const admins = orgMembers.filter(m => m.roleType === 'admin');
  const leaders = orgMembers.filter(m => m.roleType === 'leader');
  const members = orgMembers.filter(m => m.roleType === 'member');

  // Nhóm thành viên theo Trưởng ban quản lý trực tiếp
  const membersByLeader: Record<string, OrgMember[]> = {};
  const generalMembers: OrgMember[] = [];

  members.forEach(m => {
    if (m.parentLeaderId && leaders.some(l => l.id === m.parentLeaderId)) {
      if (!membersByLeader[m.parentLeaderId]) {
        membersByLeader[m.parentLeaderId] = [];
      }
      membersByLeader[m.parentLeaderId].push(m);
    } else {
      generalMembers.push(m);
    }
  });

  const totalColsCount = leaders.length + (generalMembers.length > 0 ? 1 : 0);

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
              {founders.map((m) => (
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
            {admins.length > 0 && (
              <div className="w-[3px] h-12 bg-gradient-to-b from-[#D4AF37] to-amber-500 my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-sm" />
              </div>
            )}

            {/* Tier 2: Thư ký / Admin */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {admins.map((m) => (
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

            {/* Connecting Line 2 (Admins to Leaders container) */}
            {totalColsCount > 0 && (
              <div className="w-[3px] h-12 bg-gradient-to-b from-amber-500 to-[#CD7F32] my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#CD7F32] rounded-full shadow-sm" />
              </div>
            )}

            {/* Tier 3 & Tier 4: Các Trưởng Ban (kèm Thành viên trực thuộc) và Thành viên chung */}
            {totalColsCount > 0 && (
              <div className="relative flex flex-row items-start justify-center gap-x-16 gap-y-20 flex-wrap pt-10 w-full">
                {/* Horizontal line connecting columns on desktop */}
                {totalColsCount > 1 && (
                  <div className="hidden md:block absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                )}

                {/* Render Leader Columns */}
                {leaders.map((leader) => {
                  const subMembers = membersByLeader[leader.id] || [];
                  return (
                    <div key={leader.id} className="relative flex flex-col items-center flex-1 min-w-[280px] max-w-full">
                      {/* Vertical connector to horizontal bar */}
                      {totalColsCount > 1 && (
                        <div className="hidden md:block absolute top-[-40px] w-[2px] h-[40px] bg-amber-500/50" />
                      )}

                      {/* Leader Card */}
                      <MotionDiv
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 flex flex-col items-center"
                      >
                        <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#CD7F32] via-[#F5D6B8] to-[#995C24] shadow-md">
                          {leader.image ? (
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-inner"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-[#CD7F32]/10 border-4 border-white shadow-inner flex items-center justify-center text-[#995C24] font-black text-lg">
                              {getInitials(leader.name)}
                            </div>
                          )}
                          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#995C24] text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider whitespace-nowrap">
                            TRƯỞNG BAN
                          </span>
                        </div>
                        <div className="mt-5 bg-white border border-[#CD7F32]/25 rounded-2xl p-5 shadow-sm w-64 transition-all hover:scale-105 hover:border-[#CD7F32]/50 duration-300 text-center">
                          <h4 className="text-sm font-black text-gray-900">{leader.name}</h4>
                          {leader.department && (
                            <span className="inline-block bg-[#CD7F32]/10 text-[#995C24] text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mt-1.5 mb-1">
                              {leader.department}
                            </span>
                          )}
                          <p className="text-[9px] text-[#CD7F32] font-bold uppercase tracking-wider mt-0.5">{leader.company}</p>
                          <div className="w-8 h-[1px] bg-[#CD7F32]/10 mx-auto my-2.5" />
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                            {leader.role}
                          </p>
                        </div>
                      </MotionDiv>

                      {/* Connector line from Leader to Sub-members */}
                      {subMembers.length > 0 && (
                        <div className="w-[2px] h-10 bg-gradient-to-b from-[#CD7F32]/60 to-gray-200 my-3" />
                      )}

                      {/* Sub-members grid (centered under Leader) */}
                      {subMembers.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 w-full mt-1">
                          {subMembers.map((m) => (
                            <MotionDiv
                              key={m.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4 }}
                              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center duration-300 w-44"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 mb-3 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                                {m.image ? (
                                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[#D4AF37]/10 text-[#B8860B] font-bold text-xs">
                                    {getInitials(m.name)}
                                  </div>
                                )}
                              </div>
                              <h4 className="text-xs font-black text-gray-900 line-clamp-1">{m.name}</h4>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                                Thành viên
                              </span>
                              <span className="text-[8px] text-[#B8860B] font-bold block mb-2 uppercase line-clamp-1">
                                {m.company}
                              </span>
                              <p className="text-[11px] text-gray-600 font-semibold leading-relaxed mt-1 line-clamp-2">
                                {m.role}
                              </p>
                            </MotionDiv>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* General Members Column (if any) */}
                {generalMembers.length > 0 && (
                  <div className="relative flex flex-col items-center flex-1 min-w-[280px] max-w-full">
                    {/* Vertical connector to horizontal bar */}
                    {totalColsCount > 1 && (
                      <div className="hidden md:block absolute top-[-40px] w-[2px] h-[40px] bg-gray-300/50" />
                    )}

                    {/* General Members Header Card */}
                    <MotionDiv
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div className="relative p-1 rounded-full bg-gradient-to-tr from-gray-300 via-gray-100 to-gray-450 shadow-md">
                        <div className="w-20 h-20 rounded-full bg-gray-50 border-4 border-white shadow-inner flex items-center justify-center text-gray-400 font-black text-lg">
                          STN
                        </div>
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider whitespace-nowrap">
                          THÀNH VIÊN
                        </span>
                      </div>
                      <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm w-64 transition-all hover:scale-105 duration-300 text-center">
                        <h4 className="text-sm font-black text-gray-900">Thành viên chung</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Săn Tài Năng</p>
                        <div className="w-8 h-[1px] bg-gray-150 mx-auto my-2.5" />
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                          Các thành viên hoạt động độc lập hoặc chưa phân ban cụ thể.
                        </p>
                      </div>
                    </MotionDiv>

                    {/* Connector line to general members */}
                    <div className="w-[2px] h-10 bg-gray-250 my-3" />

                    {/* General members list */}
                    <div className="flex flex-wrap justify-center gap-4 w-full mt-1">
                      {generalMembers.map((m) => (
                        <MotionDiv
                          key={m.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                          className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center duration-300 w-44"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 mb-3 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                            {m.image ? (
                              <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#D4AF37]/10 text-[#B8860B] font-bold text-xs">
                                {getInitials(m.name)}
                              </div>
                            )}
                          </div>
                          <h4 className="text-xs font-black text-gray-900 line-clamp-1">{m.name}</h4>
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">
                            Thành viên
                          </span>
                          <span className="text-[8px] text-[#B8860B] font-bold block mb-2 uppercase line-clamp-1">
                            {m.company}
                          </span>
                          <p className="text-[11px] text-gray-600 font-semibold leading-relaxed mt-1 line-clamp-2">
                            {m.role}
                          </p>
                        </MotionDiv>
                      ))}
                    </div>
              </div>
            )}

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

      {/* Form Đăng ký thành viên mới */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FFC107]/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="p-8 md:p-10 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-xl bg-white/70 backdrop-blur-sm">
            <div className="text-center mb-8">
              <span className="inline-block text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2.5 py-1 rounded-md mb-3">
                Gia nhập Cộng đồng HR
              </span>
              <h2 className="text-2xl font-black text-gray-900 mb-1.5 uppercase tracking-wide">Đăng ký thành viên mới</h2>
              <p className="text-xs font-semibold text-gray-500 max-w-md mx-auto leading-relaxed">
                Hãy tham gia cùng 3500+ thành viên để mở rộng kết nối và phát triển cơ hội nghề nghiệp trong ngành Nhân sự.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-white border border-[#D4AF37]/30 text-[#B8860B] text-center flex flex-col items-center justify-center space-y-3 font-bold text-sm shadow-inner animate-pulse">
                  <CheckCircle size={32} className="text-[#D4AF37]" />
                  <span>Đăng ký tham gia cộng đồng thành công!</span>
                  <span className="text-xs text-gray-400 font-semibold">Thông tin của bạn đã được chuyển tới Ban Quản Trị phê duyệt.</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
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

                    <div className="flex flex-col space-y-1.5">
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
                    <div className="flex flex-col space-y-1.5">
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

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Số năm kinh nghiệm HR *</label>
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
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Tên đơn vị công tác *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Job Service"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
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

                  <div className="flex flex-col space-y-1.5">
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
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 mt-4"
                  >
                    <Send size={14} />
                    <span>Nộp đơn đăng ký thành viên</span>
                  </button>
                </>
              )}
            </form>
          </div>
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
