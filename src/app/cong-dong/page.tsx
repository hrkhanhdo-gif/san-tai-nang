'use client';

import { useState, useEffect } from 'react';
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
  Heart,
  MessageSquare,
  Calendar,
  PlusCircle,
  Check,
  X,
  Eye,
  FileText
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

import { dbHelper, UserSession, CommunityActivity, Member, JobApplication, Job } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

const ActivityImagesCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group/carousel">
      <img
        src={images[currentIndex]}
        alt="Activity"
        className="w-full h-full object-cover transition-all duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xs opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xs opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-[#D4AF37] scale-110' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function Community() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'join' | 'activities' | 'members' | 'applications'>('join');
  const [activitiesList, setActivitiesList] = useState<CommunityActivity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<CommunityActivity | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'Workshop' as 'Workshop' | 'Networking' | 'Seminar' | 'Sự kiện',
    description: '',
    date: '',
    attendees: 30,
    imageType: 'books' as 'books' | 'handshake' | 'briefcase' | 'target' | 'party' | 'coffee',
    images: [] as string[]
  });
  const [isAdminPostSuccess, setIsAdminPostSuccess] = useState(false);

  useEffect(() => {
    // Load session
    setCurrentUser(dbHelper.getCurrentUser());
    
    // Load data
    async function loadData() {
      const data = await dbHelper.getActivities();
      setActivitiesList(data);
      
      const membersData = await dbHelper.getMembers();
      setMembers(membersData);
      
      const appsData = await dbHelper.getApplications();
      setApplications(appsData);
      
      const jobsData = await dbHelper.getJobs();
      setJobs(jobsData);
    }
    loadData();

    const handleLoginChange = () => {
      setCurrentUser(dbHelper.getCurrentUser());
    };
    window.addEventListener('sntn_login_change', handleLoginChange);
    return () => {
      window.removeEventListener('sntn_login_change', handleLoginChange);
    };
  }, []);

  const handleOpenCV = (cvLink: string, fullName: string) => {
    if (!cvLink) return;
    const cleanName = fullName.replace(/[^a-zA-Z0-9À-ỹ\s]/g, '').replace(/\s+/g, '_');
    const filename = `CV_${cleanName}.pdf`;

    if (cvLink.startsWith('data:')) {
      try {
        const parts = cvLink.split(';base64,');
        if (parts.length === 2) {
          const contentType = parts[0].split(':')[1] || 'application/pdf';
          const byteCharacters = atob(parts[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: contentType });
          const blobUrl = URL.createObjectURL(blob);
          
          if (contentType.toLowerCase().includes('pdf')) {
            const newTab = window.open();
            if (newTab) {
              newTab.location.href = blobUrl;
            } else {
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = filename;
              link.click();
            }
          } else {
            const link = document.createElement('a');
            link.href = blobUrl;
            const ext = contentType.includes('word') || contentType.includes('officedocument') ? 'docx' : 'pdf';
            link.download = `CV_${cleanName}.${ext}`;
            link.click();
          }
          return;
        }
      } catch (e) {
        console.error('Error decoding base64 CV:', e);
      }
    }
    
    const link = document.createElement('a');
    link.href = cvLink;
    link.target = '_blank';
    link.download = filename;
    link.click();
  };

  const handleApproveMember = async (member: Member) => {
    const success = await dbHelper.approveMember(member.id);
    if (success) {
      const updated = await dbHelper.getMembers();
      setMembers(updated);
      
      const subjectText = "[JOB SERVICE] Thông báo phê duyệt hồ sơ gia nhập Cộng đồng Săn Tài Năng";
      const bodyText = `Chào ${member.fullName},\n\nHồ sơ gia nhập Cộng đồng Săn Tài Năng của bạn đã được phê duyệt thành công.\nDưới đây là thông tin đăng nhập của bạn:\nEmail: ${member.email}\nMật khẩu ban đầu: Matkhau123\n\nTrân trọng,\nBan Quản Trị JOB SERVICE`;
      
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: member.email,
            subject: subjectText,
            text: bodyText
          })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          alert(`Đã phê duyệt và hệ thống đã TỰ ĐỘNG gửi email thông báo mật khẩu đến ${member.email}!`);
          return;
        }
        throw new Error(data.error || 'SMTP not configured');
      } catch (err) {
        console.log('Automated email failed, falling back to mailto:', err);
        // Fallback
        const subject = encodeURIComponent(subjectText);
        const body = encodeURIComponent(bodyText);
        // Display alert first to ensure the user's action registers as a valid interaction gesture for opening the mail app
        alert(`Đã phê duyệt hồ sơ của ${member.fullName}! Mật khẩu đăng nhập ban đầu: Matkhau123. (Do máy chủ chưa cấu hình gửi thư tự động, hệ thống sẽ mở ứng dụng gửi thư cục bộ để bạn gửi thư thủ công).`);
        window.location.href = `mailto:${member.email}?subject=${subject}&body=${body}`;
      }
    }
  };

  const handleRejectMember = async (memberId: string, memberName: string) => {
    const success = await dbHelper.rejectMember(memberId);
    if (success) {
      const updated = await dbHelper.getMembers();
      setMembers(updated);
      alert(`Đã từ chối hồ sơ của ${memberName}.`);
    }
  };

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
      quote: "Chương trình Mentor Recruiter của cộng đồng rất hữu ích. Tôi đã được chị Hàng Nghĩa Thuận trực tiếp hướng dẫn kỹ năng đánh giá ứng viên cấp quản lý, nhờ đó tự tin hơn hẳn khi tham gia các buổi phỏng vấn điều hành.",
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

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Join Form State
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

  // Interactions logic
  const handleLike = async (actId: string) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập với tư cách Partner hoặc Admin để thả cảm xúc!');
      window.location.href = '/dang-nhap';
      return;
    }
    const updatedLikes = await dbHelper.toggleLikeActivity(actId, currentUser.email);
    setActivitiesList(prev => prev.map(a => a.id === actId ? { ...a, likes: updatedLikes } : a));
  };

  const toggleComments = (actId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [actId]: !prev[actId]
    }));
  };

  const handleCommentSubmit = async (e: React.FormEvent, actId: string) => {
    e.preventDefault();
    const content = commentInputs[actId]?.trim();
    if (!content) return;

    if (!currentUser) {
      alert('Vui lòng đăng nhập để bình luận!');
      window.location.href = '/dang-nhap';
      return;
    }

    const newComment = await dbHelper.addCommentToActivity(actId, {
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      content: content
    });

    setActivitiesList(prev => prev.map(a => {
      if (a.id === actId) {
        return {
          ...a,
          comments: [...(a.comments || []), newComment]
        };
      }
      return a;
    }));

    setCommentInputs(prev => ({
      ...prev,
      [actId]: ''
    }));
  };

  const handleAdminPostActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newActivity.title,
      category: newActivity.category,
      description: newActivity.description,
      date: newActivity.date || new Date().toLocaleDateString('vi-VN'),
      attendees: Number(newActivity.attendees) || 0,
      imageType: newActivity.imageType,
      images: newActivity.images
    };

    const added = await dbHelper.addActivity(payload);
    setActivitiesList([added, ...activitiesList]);
    setIsAdminPostSuccess(true);
    setNewActivity({
      title: '',
      category: 'Workshop',
      description: '',
      date: '',
      attendees: 30,
      imageType: 'books',
      images: []
    });

    setTimeout(() => {
      setIsAdminPostSuccess(false);
    }, 2000);
  };

  const emojiMap = {
    books: '📚',
    handshake: '🤝',
    briefcase: '💼',
    target: '🎯',
    party: '🎉',
    coffee: '☕'
  };

  const categories = ['Tất cả', 'Workshop', 'Networking', 'Seminar', 'Sự kiện'];

  const filteredActivities = activitiesList.filter(act => {
    if (selectedCategory === 'Tất cả') return true;
    return act.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Banner */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            Gia nhập cộng đồng nhân sự Việt Nam
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6 mb-6">
            Cộng đồng <span className="gradient-gold-text">Săn Tài Năng</span>
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Học hỏi chuyên môn, kết nối nghề nghiệp và chia sẻ các hoạt động cùng mạng lưới quản lý nhân lực hàng đầu tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="max-w-7xl mx-auto px-6 border-b border-gray-100 flex space-x-6 justify-center md:justify-start flex-wrap">
        <button
          onClick={() => setActiveTab('join')}
          className={`py-4 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'join'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {currentUser?.role === 'admin' ? 'Đơn đăng ký gia nhập' : 'Thông tin gia nhập'}
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`py-4 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'activities'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Hoạt động trên cộng đồng</span>
          <span className="bg-[#D4AF37]/10 text-[#B8860B] text-[10px] px-2 py-0.5 rounded-full font-bold">
            Mới
          </span>
        </button>
        {currentUser?.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'members'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Danh sách cộng đồng
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'applications'
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Đơn ứng tuyển mới
            </button>
          </>
        )}
      </div>

      {activeTab === 'join' && (
        currentUser?.role === 'admin' ? (
          <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                  <Users className="text-[#D4AF37]" size={22} />
                  <span>Hồ sơ đăng ký gia nhập cộng đồng (Chờ duyệt)</span>
                </h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Phê duyệt hồ sơ đăng ký gia nhập và cấp tài khoản ban đầu cho thành viên mới.
                </p>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                {members.filter(m => m.status === 'pending' || !m.status).length === 0 ? (
                  <div className="text-center py-20 bg-gray-50/30">
                    <p className="text-sm font-bold text-gray-400">Không có đơn đăng ký gia nhập nào đang chờ duyệt.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        <th className="p-4">Ứng viên</th>
                        <th className="p-4">Công ty & Chức danh</th>
                        <th className="p-4">Kinh nghiệm</th>
                        <th className="p-4">Thông tin liên hệ & LinkedIn</th>
                        <th className="p-4">Ngày đăng ký</th>
                        <th className="p-4 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                      {members.filter(m => m.status === 'pending' || !m.status).map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-black text-gray-900 block">{member.fullName}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-black text-gray-900 block">{member.title}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{member.company}</span>
                          </td>
                          <td className="p-4 text-gray-600 font-bold">{member.experience} năm</td>
                          <td className="p-4 space-y-1">
                            <span className="block text-[11px]">{member.email}</span>
                            <span className="block text-[11px] text-gray-400">{member.phone}</span>
                            {member.linkedin && (
                              <a href={member.linkedin} target="_blank" rel="noreferrer" className="inline-block text-[#0077B5] hover:underline text-[10px] font-bold">
                                LinkedIn Profile
                              </a>
                            )}
                          </td>
                          <td className="p-4 text-[10px] text-gray-400">
                            {new Date(member.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleApproveMember(member)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#B8860B] text-[10px] font-black uppercase rounded-lg transition-colors"
                              >
                                <Check size={11} />
                                <span>Duyệt</span>
                              </button>
                              <button
                                onClick={() => handleRejectMember(member.id, member.fullName)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-lg transition-colors"
                              >
                                <X size={11} />
                                <span>Từ chối</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        ) : (
          <>
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

            {/* Registration Form */}
            <section className="section-padding bg-white">
              <div className="max-w-3xl mx-auto px-6">
                <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-lg relative">
                  <h3 className="text-xl font-black text-gray-900 mb-2 text-center">Đăng ký thành viên cộng đồng</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed text-center">
                    Vui lòng điền thông tin để đăng ký tham gia mạng lưới Săn Tài Năng. Đội ngũ Ban quản trị sẽ rà soát thông tin và liên hệ kích hoạt tài khoản trong vòng 24h.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {isSuccess ? (
                      <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/30 text-[#B8860B] text-center flex items-center justify-center space-x-2 font-bold text-sm">
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
          </>
        )
      )}

      {activeTab === 'activities' && (
        /* ACTIVITIES TAB */
        <section className="py-12 bg-white max-w-7xl mx-auto px-6">
          {/* Admin Create Activity Trigger & Panel */}
          {currentUser?.role === 'admin' && (
            <div className="mb-10 p-6 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/20 shadow-md">
              <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2 border-b border-[#D4AF37]/15 pb-3 mb-5 uppercase tracking-wider">
                <PlusCircle className="text-[#D4AF37]" size={18} />
                <span>Tạo bài viết / Hoạt động mới (Dành cho Ban Quản Trị)</span>
              </h3>

              {isAdminPostSuccess ? (
                <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/30 text-[#B8860B] text-center flex items-center justify-center space-x-2 font-bold text-sm">
                  <CheckCircle size={16} />
                  <span>Bài viết đã được đăng tải thành công lên cộng đồng!</span>
                </div>
              ) : (
                <form onSubmit={handleAdminPostActivity} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Tên hoạt động / Tiêu đề bài đăng *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Workshop: Định hình năng lực Recruiter thế hệ mới"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Phân loại chuyên mục *</label>
                      <select
                        value={newActivity.category}
                        onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as 'Workshop' | 'Networking' | 'Seminar' | 'Sự kiện' })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Networking">Networking</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Sự kiện">Sự kiện</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Ngày diễn ra / Đăng bài</label>
                      <input
                        type="text"
                        placeholder="Để trống lấy ngày hôm nay"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Số lượng người tham gia dự kiến</label>
                      <input
                        type="number"
                        min="1"
                        value={newActivity.attendees}
                        onChange={(e) => setNewActivity({ ...newActivity, attendees: Number(e.target.value) })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Hình ảnh bài viết (Tối đa 3 hình)</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (newActivity.images.length + files.length > 3) {
                            alert('Chỉ được chọn tối đa 3 hình ảnh!');
                            return;
                          }
                          
                          files.forEach(file => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setNewActivity(prev => ({
                                  ...prev,
                                  images: [...prev.images, reader.result as string]
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        disabled={newActivity.images.length >= 3}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#D4AF37]/10 file:text-[#B8860B] hover:file:bg-[#D4AF37]/20 transition-all cursor-pointer bg-white border border-gray-300 py-1.5 px-2 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                      />
                      {newActivity.images.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {newActivity.images.map((img, idx) => (
                            <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D4AF37]/20 bg-gray-50 shadow-sm">
                              <img src={img} className="w-full h-full object-cover" alt="Preview" />
                              <button
                                type="button"
                                onClick={() => setNewActivity(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx)
                                }))}
                                className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl hover:bg-red-700 transition-colors"
                              >
                                <X size={8} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700">Nội dung chi tiết bài viết *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Nhập nội dung chia sẻ chi tiết cho cộng đồng..."
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md"
                  >
                    Đăng tải hoạt động lên cộng đồng
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Category filters (Tags) */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                    isActive
                      ? 'gradient-gold-bg text-white border-transparent shadow-md scale-[1.03]'
                      : 'bg-white border-[#D4AF37]/20 text-[#B8860B] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Activities list grid */}
          {filteredActivities.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#D4AF37]/20 rounded-3xl bg-[#FDFBF7]">
              <p className="text-sm font-bold text-gray-500">Chưa có hoạt động nào được chia sẻ trong phân mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((act) => {
                const isLiked = currentUser ? act.likes?.includes(currentUser.email) : false;
                const showComments = expandedComments[act.id] || false;
                
                return (
                  <MotionDiv
                    key={act.id}
                    className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* Image or Emoji box */}
                      <div className="w-full h-32 rounded-2xl bg-white border border-[#D4AF37]/10 flex items-center justify-center text-4xl shadow-inner mb-5 overflow-hidden">
                        {act.images && act.images.length > 0 ? (
                          <ActivityImagesCarousel images={act.images} />
                        ) : (
                          emojiMap[act.imageType || 'books']
                        )}
                      </div>

                      {/* Tag */}
                      <span className="text-[9px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                        {act.category}
                      </span>

                      {/* Title & Description */}
                      <h4 
                        className="text-sm md:text-base font-black text-gray-900 mt-3 mb-2 leading-snug cursor-pointer hover:text-[#D4AF37] transition-colors"
                        onClick={() => setSelectedActivityDetail(act)}
                      >
                        {act.title}
                      </h4>
                      <p 
                        className="text-xs text-gray-500 font-semibold leading-relaxed mb-3 line-clamp-3 cursor-pointer hover:text-gray-700 transition-colors"
                        onClick={() => setSelectedActivityDetail(act)}
                      >
                        {act.description}
                      </p>
                      <button
                        onClick={() => setSelectedActivityDetail(act)}
                        className="text-[10px] font-black uppercase text-[#B8860B] hover:text-[#D4AF37] mb-6 transition-colors block"
                      >
                        Xem chi tiết bài viết →
                      </button>

                      {/* Meta information */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 border-t border-gray-100 pt-4 mb-4">
                        <span className="flex items-center space-x-1">
                          <Calendar size={13} className="text-[#D4AF37]" />
                          <span>{act.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users size={13} className="text-[#D4AF37]" />
                          <span>{act.attendees} người tham gia</span>
                        </span>
                      </div>
                    </div>

                    {/* Interactions Bar */}
                    <div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <button
                          onClick={() => handleLike(act.id)}
                          className={`flex items-center space-x-1.5 text-xs font-bold transition-colors ${
                            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
                          <span>{act.likes?.length || 0} Thích</span>
                        </button>
                        <button
                          onClick={() => toggleComments(act.id)}
                          className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-[#D4AF37] transition-colors"
                        >
                          <MessageSquare size={14} />
                          <span>{act.comments?.length || 0} Bình luận</span>
                        </button>
                      </div>

                      {/* Collapsible comments section */}
                      {showComments && (
                        <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                          <div className="max-h-40 overflow-y-auto space-y-2.5 pr-1">
                            {act.comments && act.comments.length > 0 ? (
                              act.comments.map((comm) => (
                                <div key={comm.id} className="text-[11px] bg-white p-2.5 rounded-xl border border-gray-100">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-black text-gray-800">{comm.userName}</span>
                                    <span className="text-[8px] font-extrabold text-[#B8860B] uppercase tracking-wider">
                                      {comm.userRole === 'admin' ? 'BQT' : 'Partner'}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 font-semibold leading-relaxed">{comm.content}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-gray-400 font-semibold text-center py-2">
                                Chưa có bình luận nào. Hãy là người đầu tiên!
                              </p>
                            )}
                          </div>

                          {/* New comment input */}
                          <form onSubmit={(e) => handleCommentSubmit(e, act.id)} className="flex items-center space-x-1.5 pt-2">
                            <input
                              type="text"
                              required
                              disabled={!currentUser}
                              placeholder={
                                currentUser
                                  ? "Viết bình luận của bạn..."
                                  : "Vui lòng đăng nhập để bình luận..."
                              }
                              value={commentInputs[act.id] || ''}
                              onChange={(e) => setCommentInputs({ ...commentInputs, [act.id]: e.target.value })}
                              className="flex-grow px-3 py-2 rounded-xl border border-gray-200 text-[11px] font-semibold focus:outline-none focus:border-[#D4AF37] bg-white"
                            />
                            {currentUser ? (
                              <button
                                type="submit"
                                className="p-2 rounded-xl bg-gray-900 hover:bg-[#D4AF37] text-white transition-colors"
                              >
                                <Send size={11} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => (window.location.href = '/dang-nhap')}
                                className="px-2 py-1.5 rounded-xl border border-[#D4AF37] text-[9px] font-bold text-[#B8860B]"
                              >
                                Đăng nhập
                              </button>
                            )}
                          </form>
                        </div>
                      )}
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === 'members' && currentUser?.role === 'admin' && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                <Users className="text-[#D4AF37]" size={22} />
                <span>Danh sách Thành viên Cộng đồng</span>
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Quản lý thông tin và thống kê số tin tuyển dụng, số ứng viên của các thành viên đã được phê duyệt.
              </p>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
              {members.filter(m => m.status === 'approved').length === 0 ? (
                <div className="text-center py-20 bg-gray-50/30">
                  <p className="text-sm font-bold text-gray-400">Chưa có thành viên cộng đồng nào được phê duyệt.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="p-4">Họ tên</th>
                      <th className="p-4">Thông tin liên hệ</th>
                      <th className="p-4">Chức danh & Công ty</th>
                      <th className="p-4">Thời gian gia nhập</th>
                      <th className="p-4 text-center">Số tin tuyển dụng</th>
                      <th className="p-4 text-center">Số ứng viên</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                    {members.filter(m => m.status === 'approved').map((member) => {
                      const memberJobs = jobs.filter(j => j.posted_by === member.email);
                      const jobCount = memberJobs.length;
                      const appCount = applications.filter(app => memberJobs.some(j => j.id === app.jobId)).length;

                      return (
                        <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-black text-gray-900">{member.fullName}</td>
                          <td className="p-4 space-y-1">
                            <span className="block text-[11px]">{member.email}</span>
                            <span className="block text-[11px] text-gray-400">{member.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-black text-gray-900 block">{member.title}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{member.company}</span>
                          </td>
                          <td className="p-4 text-[10px] text-gray-400">
                            {new Date(member.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="p-4 text-center font-black text-[#B8860B]">{jobCount}</td>
                          <td className="p-4 text-center font-black text-[#B8860B]">{appCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'applications' && currentUser?.role === 'admin' && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                <FileText className="text-[#D4AF37]" size={22} />
                <span>Danh sách Đơn ứng tuyển mới</span>
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Xem toàn bộ hồ sơ CV ứng tuyển từ ứng viên nộp cho tất cả các vị trí công việc.
              </p>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
              {applications.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/30">
                  <p className="text-sm font-bold text-gray-400">Chưa có ứng viên nào nộp CV ứng tuyển.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="p-4">Ứng viên</th>
                      <th className="p-4">Thông tin liên hệ</th>
                      <th className="p-4">Vị trí ứng tuyển</th>
                      <th className="p-4">Liên kết</th>
                      <th className="p-4">Ngày nộp</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-black text-gray-900 block">
                            {app.fullName}
                            {app.isReferral && (
                              <span className="inline-block bg-[#D4AF37]/10 text-[#B8860B] text-[8px] font-black uppercase px-2 py-0.5 rounded ml-2">
                                Được giới thiệu
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="block text-[11px]">{app.email}</span>
                          <span className="block text-[11px] text-gray-400">{app.phone}</span>
                          {app.isReferral && (
                            <div className="mt-1.5 pt-1.5 border-t border-dashed border-[#D4AF37]/20 text-[9px] text-gray-600">
                              <span className="font-bold text-[#B8860B] block">Người giới thiệu:</span>
                              <span className="font-bold text-gray-800">{app.referrerName}</span>
                              <span className="block text-[8px] text-gray-400">{app.referrerEmail} - {app.referrerPhone}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="font-black text-gray-900 block leading-tight">{app.jobTitle}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">{app.company}</span>
                        </td>
                        <td className="p-4 space-y-2">
                          {app.cvLink && (
                            <button
                              onClick={() => handleOpenCV(app.cvLink, app.fullName)}
                              className="inline-flex items-center space-x-1 text-[#B8860B] hover:underline text-[11px] font-bold bg-transparent border-none cursor-pointer text-left"
                            >
                              <Eye size={12} />
                              <span>Mở CV cá nhân</span>
                            </button>
                          )}
                          {app.linkedin && (
                            <a href={app.linkedin} target="_blank" rel="noreferrer" className="block text-[#0077B5] hover:underline text-[10px] font-bold mt-1">
                              LinkedIn Profile
                            </a>
                          )}
                        </td>
                        <td className="p-4 text-[10px] text-gray-400">
                          {new Date(app.created_at).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Activity Detail Modal */}
      {selectedActivityDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl bg-white rounded-3xl border border-[#D4AF37]/20 shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedActivityDetail(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 z-10 bg-white/80 p-1.5 rounded-full shadow-sm hover:scale-110 transition-all"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto pr-1 space-y-6">
              {/* Image Banner */}
              <div className="w-full max-w-3xl mx-auto h-64 md:h-[450px] rounded-2xl bg-gray-50 border border-[#D4AF37]/15 overflow-hidden flex items-center justify-center text-6xl shadow-inner relative flex-shrink-0">
                {selectedActivityDetail.images && selectedActivityDetail.images.length > 0 ? (
                  <ActivityImagesCarousel images={selectedActivityDetail.images} />
                ) : (
                  emojiMap[selectedActivityDetail.imageType || 'books']
                )}
              </div>

              {/* Content Wrapper */}
              <div className="w-full max-w-3xl mx-auto space-y-6">
                {/* Tag & Meta Info */}
                <div className="space-y-3">
                  <span className="inline-block text-xs font-black text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                    {selectedActivityDetail.category}
                  </span>

                  <h3 className="text-xl md:text-3xl font-black text-gray-900 leading-tight">
                    {selectedActivityDetail.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 pt-2 border-t border-b border-gray-100 py-3">
                    <span className="flex items-center space-x-1.5">
                      <Calendar size={15} className="text-[#D4AF37]" />
                      <span>Thời gian: {selectedActivityDetail.date}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Users size={15} className="text-[#D4AF37]" />
                      <span>Dự kiến: {selectedActivityDetail.attendees} người tham gia</span>
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider text-[#B8860B]">Nội dung chi tiết</h4>
                  <div className="text-sm text-gray-700 leading-relaxed font-semibold whitespace-pre-line bg-[#FDFBF7]/60 p-5 md:p-6 rounded-2xl border border-[#D4AF37]/10 shadow-sm">
                    {selectedActivityDetail.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedActivityDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF37] transition-colors"
              >
                Đóng
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </div>
  );
}
