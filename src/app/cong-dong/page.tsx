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
  Check,
  X,
  Eye,
  FileText,
  Plus,
  Edit,
  Trash2,
  Camera,
  Upload
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

import { dbHelper, UserSession, Member, JobApplication, Job, OrgMember, HonoredMember, SystemSettings } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

export default function Community() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'join' | 'members' | 'applications' | 'content'>('join');
  const [members, setMembers] = useState<Member[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [honoredMembers, setHonoredMembers] = useState<HonoredMember[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({});
  const [contentSubTab, setContentSubTab] = useState<'org' | 'honored' | 'homepage' | 'thuanhn'>('org');

  // Org member form state
  const [orgForm, setOrgForm] = useState({
    id: '',
    name: '',
    role: '',
    company: '',
    image: '',
    roleType: 'member' as 'founder' | 'secretary' | 'member'
  });
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  // Honored member form state
  const [honoredForm, setHonoredForm] = useState({
    id: '',
    name: '',
    company: '',
    title: '',
    image: '',
    reason: ''
  });
  const [isEditingHonored, setIsEditingHonored] = useState(false);

  // System settings form state
  const [settingsForm, setSettingsForm] = useState<SystemSettings>({});

  useEffect(() => {
    // Load session
    setCurrentUser(dbHelper.getCurrentUser());
    
    // Load data
    async function loadData() {
      const membersData = await dbHelper.getMembers();
      setMembers(membersData);
      
      const appsData = await dbHelper.getApplications();
      setApplications(appsData);
      
      const jobsData = await dbHelper.getJobs();
      setJobs(jobsData);

      const orgData = await dbHelper.getOrgMembers();
      setOrgMembers(orgData);

      const honoredData = await dbHelper.getHonoredMembers();
      setHonoredMembers(honoredData);

      const settingsData = await dbHelper.getSystemSettings();
      const initializedSettings = {
        homepageBannerImage: settingsData.homepageBannerImage || '',
        founder1_name: settingsData.founder1_name || 'Hàng Nghĩa Thuận',
        founder1_role: settingsData.founder1_role || 'Co-Founder & CEO - Job Service',
        founder1_image: settingsData.founder1_image || '/thuan-hn.jpg',
        founder1_quote: settingsData.founder1_quote || 'Săn Tài Năng ra đời với khao khát kết nối hàng ngàn chuyên gia nhân sự và headhunter hàng đầu tại Việt Nam. Chúng tôi tin rằng khi tri thức và cơ hội được sẻ chia rộng rãi, cộng đồng sẽ cùng nhau bứt phá và kiến tạo các giá trị nhân sự bền vững cho doanh nghiệp.',
        
        founder2_name: settingsData.founder2_name || 'Nguyễn Văn A',
        founder2_role: settingsData.founder2_role || 'Co-Founder',
        founder2_image: settingsData.founder2_image || '',
        founder2_quote: settingsData.founder2_quote || 'Hợp tác chia sẻ ứng viên và chia sẻ kinh nghiệm là chìa khóa vàng giúp nhà tuyển dụng tối ưu hóa chi phí và thời gian. Cộng đồng Săn Tài Năng chính là bệ phóng giúp các Recruiter nâng cao vị thế và chia sẻ những bài học thực chiến giá trị.',
        
        founder3_name: settingsData.founder3_name || 'Trần Văn B',
        founder3_role: settingsData.founder3_role || 'Co-Founder',
        founder3_image: settingsData.founder3_image || '',
        founder3_quote: settingsData.founder3_quote || 'Kiến tạo một hệ sinh thái kết nối nhân tài minh bạch, uy tín và hiệu quả là mục tiêu hàng đầu của chúng tôi. Tại đây, mỗi Headhunter đều tìm thấy những đối tác chiến lược tin cậy, thúc đẩy doanh số và khẳng định năng lực cá nhân.',
        
        thuanHn_about1: settingsData.thuanHn_about1 || 'Hơn 15 năm kinh nghiệm trong lĩnh vực tuyển dụng và thu hút tài năng cho các doanh nghiệp đa ngành trong và ngoài nước.',
        thuanHn_about2: settingsData.thuanHn_about2 || 'Tôi có thế mạnh chuyên sâu trong việc hoạch định chiến lược nhân lực toàn diện, thiết kế quy chuẩn phỏng vấn và trực tiếp săn lùng các ứng viên cấp trung, cấp cao, nhân sự chủ chốt cho doanh nghiệp.',
        thuanHn_about3: settingsData.thuanHn_about3 || 'Từng chịu trách nhiệm triển khai hệ thống tuyển dụng cho tập đoàn sản xuất - dịch vụ quy mô lớn hơn 3.500 nhân sự và 26 chi nhánh toàn quốc, tôi luôn hướng tới triết lý: Nhân sự là đối tác chiến lược đồng hành cùng sự phát triển bền vững của doanh nghiệp.',
        thuanHn_role: settingsData.thuanHn_role || 'Co-Founder & CEO - Job Service',
        thuanHn_image: settingsData.thuanHn_image || '/thuan-hn.jpg',
        thuanHn_phone: settingsData.thuanHn_phone || '+84 98 61 62 568',
        thuanHn_email: settingsData.thuanHn_email || 'ttg.thuanhn@gmail.com',
        thuanHn_address: settingsData.thuanHn_address || 'KDC Lê Thành, An Lạc, TP.HCM'
      };
      setSystemSettings(initializedSettings);
      setSettingsForm(initializedSettings);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ORG MEMBERS HANDLERS ---
  const handleSaveOrgMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: OrgMember = {
      id: orgForm.id || 'org-' + Math.random().toString(36).substr(2, 9),
      name: orgForm.name,
      role: orgForm.role,
      company: orgForm.company,
      image: orgForm.image,
      roleType: orgForm.roleType,
      created_at: new Date().toISOString()
    };
    await dbHelper.saveOrgMember(payload);
    const updated = await dbHelper.getOrgMembers();
    setOrgMembers(updated);
    setOrgForm({ id: '', name: '', role: '', company: '', image: '', roleType: 'member' });
    setIsEditingOrg(false);
    alert('Đã lưu thành viên sơ đồ tổ chức thành công!');
  };

  const handleEditOrgMember = (m: OrgMember) => {
    setOrgForm({
      id: m.id,
      name: m.name,
      role: m.role,
      company: m.company,
      image: m.image,
      roleType: m.roleType
    });
    setIsEditingOrg(true);
  };

  const handleDeleteOrgMember = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi sơ đồ tổ chức?')) {
      await dbHelper.deleteOrgMember(id);
      const updated = await dbHelper.getOrgMembers();
      setOrgMembers(updated);
    }
  };

  // --- HONORED MEMBERS HANDLERS ---
  const handleSaveHonoredMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: HonoredMember = {
      id: honoredForm.id || 'honored-' + Math.random().toString(36).substr(2, 9),
      name: honoredForm.name,
      company: honoredForm.company,
      title: honoredForm.title,
      image: honoredForm.image,
      reason: honoredForm.reason,
      created_at: new Date().toISOString()
    };
    await dbHelper.saveHonoredMember(payload);
    const updated = await dbHelper.getHonoredMembers();
    setHonoredMembers(updated);
    setHonoredForm({ id: '', name: '', company: '', title: '', image: '', reason: '' });
    setIsEditingHonored(false);
    alert('Đã lưu thành viên vinh danh thành công!');
  };

  const handleEditHonoredMember = (m: HonoredMember) => {
    setHonoredForm({
      id: m.id,
      name: m.name,
      company: m.company,
      title: m.title,
      image: m.image,
      reason: m.reason
    });
    setIsEditingHonored(true);
  };

  const handleDeleteHonoredMember = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi danh sách vinh danh?')) {
      await dbHelper.deleteHonoredMember(id);
      const updated = await dbHelper.getHonoredMembers();
      setHonoredMembers(updated);
    }
  };

  // --- SYSTEM SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbHelper.saveSystemSettings(settingsForm);
    setSystemSettings(settingsForm);
    alert('Đã lưu cấu hình cài đặt hệ thống thành công!');
  };

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

      {/* Organizational Structure Section */}
      <section className="py-16 bg-[#FDFBF7]/30 border-b border-gray-100 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
              Ban Điều Hành
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-4">Cơ cấu tổ chức Cộng đồng</h2>
            <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          {/* Org Chart Container */}
          <div className="flex flex-col items-center justify-center relative py-6">
            
            {/* Founders Row */}
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
                      FOUNDER
                    </span>
                  </div>
                  <div className="mt-5 bg-white border border-[#D4AF37]/20 rounded-2xl p-5 shadow-sm max-w-xs transition-all hover:scale-105 hover:border-[#D4AF37]/50 duration-300">
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

            {/* Connecting Line 1 */}
            {orgMembers.filter(m => m.roleType === 'secretary').length > 0 && (
              <div className="w-[3px] h-14 bg-gradient-to-b from-[#D4AF37] to-gray-300 my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#D4AF37] rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full shadow-sm" />
              </div>
            )}

            {/* Secretaries Row */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {orgMembers.filter(m => m.roleType === 'secretary').map((m) => (
                <MotionDiv
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="relative p-1 rounded-full bg-gradient-to-tr from-gray-300 via-gray-100 to-gray-400 shadow-md">
                    <img
                      src={m.image || '/nguyen-thi-c.png'}
                      alt={m.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-inner"
                    />
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider whitespace-nowrap">
                      THƯ KÝ / ADMIN
                    </span>
                  </div>
                  <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm max-w-xs transition-all hover:scale-105 hover:border-gray-300 duration-300">
                    <h4 className="text-sm font-black text-gray-900">{m.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{m.company}</p>
                    <div className="w-8 h-[1px] bg-gray-200 mx-auto my-2.5" />
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      {m.role}
                    </p>
                  </div>
                </MotionDiv>
              ))}
            </div>

            {/* Connecting Line 2 */}
            {orgMembers.filter(m => m.roleType === 'member').length > 0 && (
              <div className="w-[3px] h-14 bg-gradient-to-b from-gray-300 to-gray-200 my-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full shadow-sm" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-200 rounded-full shadow-sm" />
              </div>
            )}

            {/* Regular Members Row/Grid */}
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
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all flex flex-col items-center text-center duration-300"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 mb-4 flex-shrink-0 bg-gray-50">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#D4AF37]/10 text-[#B8860B] font-bold text-sm">
                            {m.name.split(' ').slice(-1)[0].substring(0,2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-gray-900">{m.name}</h4>
                      <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-wider block mt-0.5">
                        Thành viên
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold block mb-3 uppercase">
                        {m.company}
                      </span>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1 line-clamp-3">
                        {m.role}
                      </p>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent pointer-events-none" />
      </section>

      {/* Honored Members Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FDFBF7]/50 border-b border-gray-100 relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
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
              <p className="text-xs text-gray-400 font-semibold">Chưa có thành viên vinh danh nào được cập nhật.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-center text-left">
              {honoredMembers.map((m, index) => (
                <MotionDiv
                  key={m.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border border-[#D4AF37]/20 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#D4AF37]/5 blur-xl pointer-events-none" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <Award size={22} />
                      </div>
                      <span className="bg-[#D4AF37]/10 text-[#B8860B] text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">
                        Honored Member
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow flex-shrink-0 bg-gray-50">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-extrabold text-lg">
                            {m.name.substring(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-base font-black text-gray-900">{m.name}</h4>
                        <span className="text-[11px] text-[#B8860B] font-bold tracking-wide leading-tight mt-0.5">{m.title}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{m.company}</span>
                      </div>
                    </div>

                    <div className="relative bg-[#FDFBF7] border border-[#D4AF37]/10 rounded-2xl p-4.5 mb-2 italic text-xs font-semibold text-gray-600 leading-relaxed">
                      <span className="absolute -top-3 left-3 text-3xl font-serif text-[#D4AF37]/20 pointer-events-none select-none">“</span>
                      <p className="relative z-10 pt-1 whitespace-pre-line">{m.reason}</p>
                    </div>
                  </div>

                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-4 text-right border-t border-gray-100 pt-3">
                    Thành viên cống hiến 2026
                  </div>
                </MotionDiv>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Tab Switcher for Admin */}
      {currentUser?.role === 'admin' && (
        <div className="max-w-7xl mx-auto px-6 border-b border-gray-100 flex space-x-6 justify-center md:justify-start flex-wrap">
          <button
            onClick={() => setActiveTab('join')}
            className={`py-4 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'join'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Đơn đăng ký gia nhập
          </button>
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
          <button
            onClick={() => setActiveTab('content')}
            className={`py-4 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'content'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Quản lý nội dung (CMS)
          </button>
        </div>
      )}

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

      {activeTab === 'content' && currentUser?.role === 'admin' && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                <Edit className="text-[#D4AF37]" size={22} />
                <span>Quản lý nội dung hệ thống (CMS)</span>
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Tùy biến Sơ đồ tổ chức, Vinh danh thành viên, Banner và Lời chia sẻ trên Trang chủ, và Trang giới thiệu của CEO.
              </p>
            </div>

            {/* CMS Sub-tabs switcher */}
            <div className="flex border-b border-gray-100 mb-8 space-x-2 overflow-x-auto pb-1">
              {[
                { id: 'org', label: 'Sơ đồ tổ chức' },
                { id: 'honored', label: 'Vinh danh thành viên' },
                { id: 'homepage', label: 'Cấu hình Trang chủ' },
                { id: 'thuanhn', label: 'Cấu hình CEO Hằng Nghĩa Thuận' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setContentSubTab(sub.id as 'org' | 'honored' | 'homepage' | 'thuanhn')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    contentSubTab === sub.id
                      ? 'bg-[#D4AF37] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1: Sơ đồ tổ chức (org) */}
            {contentSubTab === 'org' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to Add/Edit */}
                <div className="lg:col-span-1 bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/15 shadow-sm">
                  <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                    {isEditingOrg ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                  </h4>
                  <form onSubmit={handleSaveOrgMember} className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={orgForm.name}
                        onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Cấp bậc / Nhánh *</label>
                      <select
                        value={orgForm.roleType}
                        onChange={(e) => setOrgForm({ ...orgForm, roleType: e.target.value as 'founder' | 'secretary' | 'member' })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      >
                        <option value="founder">Founder</option>
                        <option value="secretary">Thư ký / Admin</option>
                        <option value="member">Thành viên</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Công ty / Cơ quan</label>
                      <input
                        type="text"
                        value={orgForm.company}
                        onChange={(e) => setOrgForm({ ...orgForm, company: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Ví dụ: Job Service"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Chức danh / Mô tả công việc *</label>
                      <input
                        type="text"
                        required
                        value={orgForm.role}
                        onChange={(e) => setOrgForm({ ...orgForm, role: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Ví dụ: Trưởng ban điều hành"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Hình ảnh đại diện</label>
                      <div className="flex items-center space-x-3 mt-1">
                        {orgForm.image ? (
                          <img
                            src={orgForm.image}
                            alt="Avatar preview"
                            className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Camera size={16} />
                          </div>
                        )}
                        <label className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-lg cursor-pointer text-[10px] font-black uppercase text-gray-700 transition-colors">
                          <Upload size={10} />
                          <span>Tải ảnh lên</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, (base64) => setOrgForm({ ...orgForm, image: base64 }))}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Dưới 2MB, định dạng JPG, PNG, GIF</p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-sm"
                      >
                        Lưu thành viên
                      </button>
                      {isEditingOrg && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrgForm({ id: '', name: '', role: '', company: '', image: '', roleType: 'member' });
                            setIsEditingOrg(false);
                          }}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List of current members */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Danh sách sơ đồ tổ chức hiện tại</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orgMembers.map((m) => (
                      <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start justify-between shadow-sm">
                        <div className="flex items-center space-x-3">
                          <img
                            src={m.image || '/thuan-hn.jpg'}
                            alt={m.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <h5 className="text-sm font-black text-gray-900">{m.name}</h5>
                            <span className="inline-block text-[8px] font-extrabold text-white px-2 py-0.5 rounded-full mt-1 uppercase tracking-wider bg-gray-600">
                              {m.roleType === 'founder' ? 'Founder' : m.roleType === 'secretary' ? 'Thư ký / Admin' : 'Thành viên'}
                            </span>
                            <p className="text-xs text-gray-500 font-medium mt-1.5 leading-tight">{m.role}</p>
                            {m.company && <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase">{m.company}</p>}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <button
                            type="button"
                            onClick={() => handleEditOrgMember(m)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrgMember(m.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Vinh danh thành viên (honored) */}
            {contentSubTab === 'honored' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to Add/Edit */}
                <div className="lg:col-span-1 bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/15 shadow-sm">
                  <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                    {isEditingHonored ? 'Chỉnh sửa vinh danh' : 'Thêm vinh danh mới'}
                  </h4>
                  <form onSubmit={handleSaveHonoredMember} className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={honoredForm.name}
                        onChange={(e) => setHonoredForm({ ...honoredForm, name: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Nguyễn Thị Mai Chi"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Công ty *</label>
                      <input
                        type="text"
                        required
                        value={honoredForm.company}
                        onChange={(e) => setHonoredForm({ ...honoredForm, company: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Ví dụ: TechVina Group"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Chức vụ *</label>
                      <input
                        type="text"
                        required
                        value={honoredForm.title}
                        onChange={(e) => setHonoredForm({ ...honoredForm, title: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Ví dụ: TA Manager"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Lý do vinh danh *</label>
                      <textarea
                        required
                        rows={4}
                        value={honoredForm.reason}
                        onChange={(e) => setHonoredForm({ ...honoredForm, reason: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                        placeholder="Nhập lý do vinh danh chi tiết..."
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Hình ảnh đại diện</label>
                      <div className="flex items-center space-x-3 mt-1">
                        {honoredForm.image ? (
                          <img
                            src={honoredForm.image}
                            alt="Avatar preview"
                            className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Camera size={16} />
                          </div>
                        )}
                        <label className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-lg cursor-pointer text-[10px] font-black uppercase text-gray-700 transition-colors">
                          <Upload size={10} />
                          <span>Tải ảnh lên</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, (base64) => setHonoredForm({ ...honoredForm, image: base64 }))}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Dưới 2MB, định dạng JPG, PNG, GIF</p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-sm"
                      >
                        Lưu vinh danh
                      </button>
                      {isEditingHonored && (
                        <button
                          type="button"
                          onClick={() => {
                            setHonoredForm({ id: '', name: '', company: '', title: '', image: '', reason: '' });
                            setIsEditingHonored(false);
                          }}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List of current honored members */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">Danh sách vinh danh hiện tại</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {honoredMembers.map((m) => (
                      <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start justify-between shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D4AF37]/50 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                            {m.image ? (
                              <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[#D4AF37] font-black text-sm">{m.name.substring(0,1)}</span>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-gray-900">{m.name}</h5>
                            <span className="text-[10px] text-[#B8860B] font-bold block mt-0.5">{m.title}</span>
                            <span className="text-[9px] text-gray-400 font-bold block mb-2 uppercase">{m.company}</span>
                            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed italic line-clamp-2 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                              &ldquo;{m.reason}&rdquo;
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1">
                          <button
                            type="button"
                            onClick={() => handleEditHonoredMember(m)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteHonoredMember(m.id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Cấu hình Trang chủ (homepage) */}
            {contentSubTab === 'homepage' && (
              <form onSubmit={handleSaveSettings} className="space-y-8 bg-[#FDFBF7]/40 border border-gray-100 p-6 rounded-2xl shadow-sm">
                
                {/* 1. Trang chủ Banner */}
                <div>
                  <h4 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-200 pb-2">
                    1. Hình ảnh Banner Trang chủ
                  </h4>
                  <div className="flex items-center space-x-4">
                    {settingsForm.homepageBannerImage ? (
                      <div className="w-36 h-20 rounded-xl overflow-hidden border border-[#D4AF37]/35 relative">
                        <img
                          src={settingsForm.homepageBannerImage}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, homepageBannerImage: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-36 h-20 rounded-xl bg-white border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-[10px] font-bold">
                        Dùng placeholder
                      </div>
                    )}
                    <label className="flex items-center space-x-1 px-4 py-2 bg-white border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl cursor-pointer text-xs font-black uppercase text-gray-700 transition-colors">
                      <Upload size={12} />
                      <span>Chọn file ảnh banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, homepageBannerImage: base64 }))}
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Founders section */}
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider border-b border-gray-200 pb-2">
                    2. Lời chia sẻ từ 3 Founders (Trang chủ)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Founder 1 */}
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <h5 className="text-xs font-black text-[#B8860B] uppercase tracking-wider">Founder 1 (Hằng Nghĩa Thuận)</h5>
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Họ và tên</label>
                        <input
                          type="text"
                          value={settingsForm.founder1_name ?? 'Hàng Nghĩa Thuận'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder1_name: e.target.value })}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Chức danh / Vai trò</label>
                        <input
                          type="text"
                          value={settingsForm.founder1_role ?? 'Co-Founder & CEO - Job Service'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder1_role: e.target.value })}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Lời chia sẻ</label>
                        <textarea
                          rows={4}
                          value={settingsForm.founder1_quote ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder1_quote: e.target.value })}
                          placeholder="Nhập trích dẫn lời chia sẻ của founder..."
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold resize-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Hình ảnh</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <img
                            src={settingsForm.founder1_image || '/thuan-hn.jpg'}
                            alt="F1 preview"
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <label className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-50 border rounded-lg cursor-pointer text-[9px] font-bold uppercase text-gray-700">
                            <Upload size={10} />
                            <span>Tải ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, founder1_image: base64 }))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Founder 2 */}
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <h5 className="text-xs font-black text-[#B8860B] uppercase tracking-wider">Founder 2</h5>
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Họ và tên</label>
                        <input
                          type="text"
                          value={settingsForm.founder2_name ?? 'Nguyễn Văn A'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder2_name: e.target.value })}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Chức danh / Vai trò</label>
                        <input
                          type="text"
                          value={settingsForm.founder2_role ?? 'Co-Founder'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder2_role: e.target.value })}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Lời chia sẻ</label>
                        <textarea
                          rows={4}
                          value={settingsForm.founder2_quote ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder2_quote: e.target.value })}
                          placeholder="Nhập trích dẫn lời chia sẻ của founder..."
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold resize-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Hình ảnh (Base64)</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {settingsForm.founder2_image ? (
                            <img
                              src={settingsForm.founder2_image}
                              alt="F2 preview"
                              className="w-10 h-10 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">NVA</div>
                          )}
                          <label className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-50 border rounded-lg cursor-pointer text-[9px] font-bold uppercase text-gray-700">
                            <Upload size={10} />
                            <span>Tải ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, founder2_image: base64 }))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Founder 3 */}
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl space-y-3 shadow-sm">
                      <h5 className="text-xs font-black text-[#B8860B] uppercase tracking-wider">Founder 3</h5>
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Họ và tên</label>
                        <input
                          type="text"
                          value={settingsForm.founder3_name ?? 'Trần Văn B'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder3_name: e.target.value })}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Chức danh / Vai trò</label>
                        <input
                          type="text"
                          value={settingsForm.founder3_role ?? 'Co-Founder'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder3_role: e.target.value })}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Lời chia sẻ</label>
                        <textarea
                          rows={4}
                          value={settingsForm.founder3_quote ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder3_quote: e.target.value })}
                          placeholder="Nhập trích dẫn lời chia sẻ của founder..."
                          className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold resize-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-600">Hình ảnh (Base64)</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {settingsForm.founder3_image ? (
                            <img
                              src={settingsForm.founder3_image}
                              alt="F3 preview"
                              className="w-10 h-10 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">TVB</div>
                          )}
                          <label className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-50 border rounded-lg cursor-pointer text-[9px] font-bold uppercase text-gray-700">
                            <Upload size={10} />
                            <span>Tải ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, founder3_image: base64 }))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md"
                  >
                    Lưu cấu hình Trang chủ
                  </button>
                </div>
              </form>
            )}

            {/* Sub-tab 4: Cấu hình CEO Hằng Nghĩa Thuận (thuanhn) */}
            {contentSubTab === 'thuanhn' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 bg-[#FDFBF7]/40 border border-gray-100 p-6 rounded-2xl shadow-sm">
                <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider border-b border-gray-200 pb-2">
                  Cấu hình trang giới thiệu anh Hằng Nghĩa Thuận (`/ve-thuan-hn`)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left block: Portrait photo */}
                  <div className="md:col-span-1 bg-white p-5 rounded-2xl border space-y-4">
                    <h5 className="text-xs font-black text-gray-900 uppercase tracking-wider">Ảnh chân dung giới thiệu</h5>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[200px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-inner relative bg-gray-50 mb-3 flex items-center justify-center">
                        {settingsForm.thuanHn_image || settingsForm.founder1_image ? (
                          <img
                            src={settingsForm.thuanHn_image || settingsForm.founder1_image || '/thuan-hn.jpg'}
                            alt="CEO Portrait"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="text-gray-300" size={32} />
                        )}
                      </div>
                      <label className="flex items-center space-x-1 px-4 py-2 bg-[#FDFBF7] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xl cursor-pointer text-xs font-black uppercase text-gray-700 transition-colors">
                        <Upload size={12} />
                        <span>Tải ảnh chân dung mới</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, thuanHn_image: base64 }))}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Right block: Biography details and contacts */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Chức danh chính</label>
                      <input
                        type="text"
                        value={settingsForm.thuanHn_role ?? 'Co-Founder & CEO - Job Service'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_role: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Co-Founder & CEO - Job Service"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-700">Số điện thoại</label>
                        <input
                          type="text"
                          value={settingsForm.thuanHn_phone ?? '+84 98 61 62 568'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_phone: e.target.value })}
                          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-700">Email liên hệ</label>
                        <input
                          type="email"
                          value={settingsForm.thuanHn_email ?? 'ttg.thuanhn@gmail.com'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_email: e.target.value })}
                          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-700">Địa chỉ làm việc</label>
                        <input
                          type="text"
                          value={settingsForm.thuanHn_address ?? 'KDC Lê Thành, An Lạc, TP.HCM'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_address: e.target.value })}
                          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-700">Đoạn giới thiệu 1 *</label>
                        <textarea
                          rows={3}
                          required
                          value={settingsForm.thuanHn_about1 ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_about1: e.target.value })}
                          placeholder="Hơn 15 năm kinh nghiệm trong lĩnh vực..."
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-700">Đoạn giới thiệu 2</label>
                        <textarea
                          rows={3}
                          value={settingsForm.thuanHn_about2 ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_about2: e.target.value })}
                          placeholder="Tôi có thế mạnh chuyên sâu..."
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-700">Đoạn giới thiệu 3</label>
                        <textarea
                          rows={3}
                          value={settingsForm.thuanHn_about3 ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_about3: e.target.value })}
                          placeholder="Từng chịu trách nhiệm triển khai..."
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md"
                  >
                    Lưu cấu hình giới thiệu CEO
                  </button>
                </div>
              </form>
            )}

          </div>
        </section>
      )}

    </div>
  );
}
