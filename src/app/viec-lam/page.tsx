'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  X, 
  Send, 
  PlusCircle, 
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Check,
  Eye,
  FileText,
  Heart,
  Users,
  Award,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { dbHelper, Job, UserSession, JobApplication } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

export default function Jobs() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Modals & Panels State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyType, setApplyType] = useState<'apply' | 'refer'>('apply');
  const [selectedJobDetail, setSelectedJobDetail] = useState<Job | null>(null);

  const handleOpenDetail = (job: Job) => {
    setSelectedJobDetail(job);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `?jobId=${job.id}`);
    }
  };

  const handleCloseDetail = () => {
    setSelectedJobDetail(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/viec-lam');
    }
  };
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isApplySuccess, setIsApplySuccess] = useState(false);
  const [applyFallbackMailto, setApplyFallbackMailto] = useState('');
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    cvLink: ''
  });
  const [referrerForm, setReferrerForm] = useState({
    referrerName: '',
    referrerEmail: '',
    referrerPhone: ''
  });

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds(prev => 
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  // Jobs Posting Form State
  const [isPostingMode, setIsPostingMode] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    company: '',
    salary: '',
    location: 'TP. Hồ Chí Minh',
    level: 'Senior',
    type: 'Full-time',
    skills: '',
    description: '',
    requirements: '',
    benefits: '',
    workingTime: '',
    workingAddress: '',
    isHeadhunt: false,
    referralCommission: ''
  });
  const [isPostSuccess, setIsPostSuccess] = useState(false);

  // Admin Editing State
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editJobForm, setEditJobForm] = useState({
    title: '',
    company: '',
    salary: '',
    location: 'TP. Hồ Chí Minh',
    level: 'Senior',
    type: 'Full-time',
    skills: '',
    description: '',
    requirements: '',
    benefits: '',
    workingTime: '',
    workingAddress: '',
    isHeadhunt: false,
    referralCommission: ''
  });

  // CV Applications Modal
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      setCurrentUser(dbHelper.getCurrentUser());
      try {
        const [jobsData, appsData] = await Promise.all([
          dbHelper.getJobs(),
          dbHelper.getApplications()
        ]);
        setJobs(jobsData);
        setApplications(appsData);

        // Check jobId from URL search params
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const jobId = params.get('jobId');
          if (jobId) {
            const job = jobsData.find(j => j.id === jobId);
            if (job) setSelectedJobDetail(job);
          }
        }
      } catch (err) {
        console.error("Error loading jobs page data:", err);
      }
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

  // Filter Jobs based on role and search inputs
  useEffect(() => {
    // 1. Filter jobs visible to current role
    let result = jobs.filter((j) => {
      if (currentUser?.role === 'admin') return true; // Admin sees all
      if (currentUser?.role === 'partner') {
        // Partner sees approved jobs OR their own pending jobs
        return j.approved || j.posted_by === currentUser.email;
      }
      return j.approved; // Guest sees only approved
    });

    // 2. Apply search keywords
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // 3. Location filter
    if (selectedLocation !== 'all') {
      result = result.filter((j) => j.location.includes(selectedLocation));
    }

    // 4. Level filter
    if (selectedLevel !== 'all') {
      result = result.filter((j) => j.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    // 5. Working Type filter
    if (selectedType !== 'all') {
      result = result.filter((j) => j.type.toLowerCase() === selectedType.toLowerCase());
    }

    setFilteredJobs(result);
  }, [searchQuery, selectedLocation, selectedLevel, selectedType, jobs, currentUser]);

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

  // Submit Application (Save CV)
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const payload = {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      fullName: applyForm.fullName,
      email: applyForm.email,
      phone: applyForm.phone,
      linkedin: '', // Removed from UI
      cvLink: applyForm.cvLink,
      isReferral: applyType === 'refer',
      ...(applyType === 'refer' ? {
        referrerName: referrerForm.referrerName,
        referrerEmail: referrerForm.referrerEmail,
        referrerPhone: referrerForm.referrerPhone
      } : {})
    };

    const newApp = await dbHelper.addApplication(payload);

    setApplications((prev) => [newApp, ...prev]);
    setIsApplySuccess(true);

    // Trigger email client sending application to job poster (posted_by)
    const posterEmail = selectedJob.posted_by || 'ttg.thuanhn@gmail.com';
    const emailSubjectText = applyType === 'refer'
      ? `[JOB SERVICE] Đối tác giới thiệu ứng viên - Vị trí: ${selectedJob.title} - ${selectedJob.company}`
      : `[JOB SERVICE] Ứng viên ứng tuyển - Vị trí: ${selectedJob.title} - ${selectedJob.company}`;
    
    const emailBodyText = applyType === 'refer'
      ? `Chào bạn,\n\nĐối tác sau đây đã giới thiệu ứng viên cho công việc "${selectedJob.title}" của bạn trên Cộng đồng Săn Tài Năng:\n\nThông tin người giới thiệu:\n- Họ tên: ${referrerForm.referrerName}\n- Email: ${referrerForm.referrerEmail}\n- SĐT: ${referrerForm.referrerPhone}\n\nThông tin ứng viên được giới thiệu:\n- Họ tên: ${applyForm.fullName}\n- Email: ${applyForm.email}\n- SĐT: ${applyForm.phone}\n\n(Lưu ý: CV của ứng viên đã được đính kèm hoặc lưu trữ trên hệ thống Săn Tài Năng. Vui lòng kiểm tra trong thư và trang quản trị).\n\nTrân trọng,\nJOB SERVICE`
      : `Chào bạn,\n\nỨng viên sau đây đã ứng tuyển vào công việc "${selectedJob.title}" của bạn trên Cộng đồng Săn Tài Năng:\n\nThông tin ứng viên:\n- Họ tên: ${applyForm.fullName}\n- Email: ${applyForm.email}\n- SĐT: ${applyForm.phone}\n\n(Lưu ý: CV của ứng viên đã được đính kèm hoặc lưu trữ trên hệ thống Săn Tài Năng. Vui lòng kiểm tra trong thư và trang quản trị).\n\nTrân trọng,\nJOB SERVICE`;

    const cvFilename = `CV_${applyForm.fullName.replace(/\s+/g, '_')}.pdf`;

    let emailFailed = false;
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: posterEmail,
          subject: emailSubjectText,
          text: emailBodyText,
          cvLink: applyForm.cvLink,
          cvName: cvFilename
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        console.log('Automated email sent to poster!');
      } else {
        throw new Error(data.error || 'Server SMTP not configured');
      }
    } catch (err) {
      console.log('Automated email failed, falling back to mailto:', err);
      emailFailed = true;
      const emailSubject = encodeURIComponent(emailSubjectText);
      const emailBody = encodeURIComponent(emailBodyText);
      setApplyFallbackMailto(`mailto:${posterEmail}?subject=${emailSubject}&body=${emailBody}`);
    }

    setApplyForm({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      cvLink: ''
    });
    setReferrerForm({
      referrerName: '',
      referrerEmail: '',
      referrerPhone: ''
    });

    if (!emailFailed) {
      setTimeout(() => {
        setSelectedJob(null);
        setIsApplySuccess(false);
      }, 2500);
    }
  };

  // Submit Posted Job
  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const skillsArray = newJobForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (newJobForm.isHeadhunt && !skillsArray.some(s => s.toLowerCase() === 'headhunt')) {
      skillsArray.push('Headhunt');
    }

    const jobPayload = {
      title: newJobForm.title,
      company: newJobForm.company,
      salary: newJobForm.salary,
      location: newJobForm.location,
      level: newJobForm.level,
      type: newJobForm.type,
      skills: skillsArray.length > 0 ? skillsArray : ['Tuyển dụng', 'HR'],
      description: newJobForm.description,
      requirements: newJobForm.requirements,
      benefits: newJobForm.benefits,
      workingTime: newJobForm.workingTime,
      workingAddress: newJobForm.workingAddress,
      isHeadhunt: newJobForm.isHeadhunt,
      referralCommission: newJobForm.isHeadhunt ? newJobForm.referralCommission : ''
    };

    const approveImmediately = true; // Automatically approve postings immediately
    const addedJob = await dbHelper.addJob(jobPayload, currentUser.email, approveImmediately);
    setJobs([addedJob, ...jobs]);
    
    setIsPostSuccess(true);
    setNewJobForm({
      title: '',
      company: '',
      salary: '',
      location: 'TP. Hồ Chí Minh',
      level: 'Senior',
      type: 'Full-time',
      skills: '',
      description: '',
      requirements: '',
      benefits: '',
      workingTime: '',
      workingAddress: '',
      isHeadhunt: false,
      referralCommission: ''
    });

    setTimeout(() => {
      setIsPostSuccess(false);
      setIsPostingMode(false);
    }, 2500);
  };

  // Admin Actions
  const handleApproveJob = async (jobId: string) => {
    const success = await dbHelper.approveJob(jobId);
    if (success) {
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, approved: true } : j));
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      const success = await dbHelper.deleteJob(jobId);
      if (success) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    }
  };

  const startEditJob = (job: Job) => {
    setEditingJob(job);
    setEditJobForm({
      title: job.title,
      company: job.company,
      salary: job.salary,
      location: job.location,
      level: job.level,
      type: job.type,
      skills: job.skills.join(', '),
      description: job.description || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      workingTime: job.workingTime || '',
      workingAddress: job.workingAddress || '',
      isHeadhunt: job.isHeadhunt || false,
      referralCommission: job.referralCommission || ''
    });
  };

  const handleEditJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    let skillsArray = editJobForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editJobForm.isHeadhunt) {
      if (!skillsArray.some(s => s.toLowerCase() === 'headhunt')) {
        skillsArray.push('Headhunt');
      }
    } else {
      skillsArray = skillsArray.filter(s => s.toLowerCase() !== 'headhunt');
    }

    const updatedPayload = {
      title: editJobForm.title,
      company: editJobForm.company,
      salary: editJobForm.salary,
      location: editJobForm.location,
      level: editJobForm.level,
      type: editJobForm.type,
      skills: skillsArray.length > 0 ? skillsArray : ['Tuyển dụng', 'HR'],
      description: editJobForm.description,
      requirements: editJobForm.requirements,
      benefits: editJobForm.benefits,
      workingTime: editJobForm.workingTime,
      workingAddress: editJobForm.workingAddress,
      isHeadhunt: editJobForm.isHeadhunt,
      referralCommission: editJobForm.isHeadhunt ? editJobForm.referralCommission : ''
    };

    const success = await dbHelper.editJob(editingJob.id, updatedPayload);
    if (success) {
      setJobs((prev) => prev.map((j) => j.id === editingJob.id ? { ...j, ...updatedPayload } : j));
      setEditingJob(null);
    }
  };

  // Filter CVs visible to user
  const visibleApplications = applications.filter((app) => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'partner') {
      // Partner only sees applications for jobs they posted
      const job = jobs.find((j) => j.id === app.jobId);
      return job?.posted_by === currentUser.email;
    }
    return false;
  });

  return (
    <div className="bg-white min-h-screen">
      {selectedJobDetail ? (
        <JobDetailView 
          job={selectedJobDetail}
          onClose={handleCloseDetail}
          onApply={(type) => {
            setApplyType(type);
            setSelectedJob(selectedJobDetail);
          }}
          savedJobIds={savedJobIds}
          onSave={(id) => {
            toggleSaveJob(id);
            alert(savedJobIds.includes(id) ? "Đã bỏ lưu tin tuyển dụng!" : "Lưu tin tuyển dụng thành công!");
          }}
        />
      ) : (
        <>
          {/* Banner */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            Cơ hội nghề nghiệp cấp cao
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6 mb-6">
            Việc làm nhân sự <span className="gradient-gold-text">Đặc quyền</span>
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Khám phá các vị trí tuyển dụng đa ngành nghề từ các tập đoàn và doanh nghiệp đối tác uy tín toàn quốc.
          </p>
        </div>
      </section>

      {/* Main Search & Job Board */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Search Box & Filters */}
          <div className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#D4AF37]/15 shadow-sm space-y-6 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Keyword Search */}
              <div className="lg:col-span-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Nhập tên công việc, kỹ năng cần tìm (ví dụ: IT Recruitment)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#D4AF37]/20 focus:border-[#D4AF37] bg-white text-gray-800 text-sm font-semibold placeholder-gray-400 focus:outline-none transition-all"
                />
              </div>

              {/* Location Select */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/20 focus:border-[#D4AF37] bg-white text-gray-800 text-sm font-semibold focus:outline-none transition-all"
                >
                  <option value="all">Tất cả địa điểm</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Toàn quốc">Toàn quốc</option>
                </select>
              </div>

              {/* Level Select */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/20 focus:border-[#D4AF37] bg-white text-gray-800 text-sm font-semibold focus:outline-none transition-all"
                >
                  <option value="all">Tất cả cấp bậc</option>
                  <option value="Senior">Senior</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Junior / Middle">Junior / Middle</option>
                </select>
              </div>

              {/* Working Type */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/20 focus:border-[#D4AF37] bg-white text-gray-800 text-sm font-semibold focus:outline-none transition-all"
                >
                  <option value="all">Hình thức</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex justify-between items-center border-t border-[#D4AF37]/10 pt-4 flex-wrap gap-4">
              <span className="text-xs text-gray-500 font-bold flex items-center space-x-1.5">
                <Clock size={14} className="text-[#D4AF37]" />
                <span>Hiển thị {filteredJobs.length} tin tuyển dụng phù hợp</span>
              </span>
              
              <div className="flex items-center space-x-4">
                {currentUser && (currentUser.role === 'admin' || currentUser.role === 'partner') && (
                  <button
                    onClick={() => setShowApplicationsModal(true)}
                    className="flex items-center space-x-2 text-xs font-black uppercase text-[#B8860B] hover:text-[#D4AF37] transition-colors"
                  >
                    <FileText size={15} />
                    <span>Xem danh sách CV ứng tuyển ({visibleApplications.length})</span>
                  </button>
                )}
                
                <button
                  onClick={() => setIsPostingMode(!isPostingMode)}
                  className="flex items-center space-x-2 text-xs font-black uppercase text-[#B8860B] hover:text-[#D4AF37] transition-colors"
                >
                  <PlusCircle size={15} />
                  <span>Đăng tin tuyển dụng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Posting Panel */}
          {isPostingMode && (
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-8 rounded-3xl bg-white border-2 border-dashed border-[#D4AF37]/30 shadow-lg mb-12 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-4 mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
                  <PlusCircle size={18} className="text-[#D4AF37]" />
                  <span>Đăng tin cơ hội việc làm mới</span>
                </h3>
                <button onClick={() => setIsPostingMode(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {!currentUser ? (
                <div className="py-6 text-center space-y-4">
                  <p className="text-xs text-gray-500 font-bold">
                    Vui lòng đăng nhập với tài khoản **Partner** hoặc **Admin** để sử dụng tính năng đăng tin tuyển dụng.
                  </p>
                  <a
                    href="/dang-nhap"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md"
                  >
                    Đăng nhập ngay
                  </a>
                </div>
              ) : (
                <form onSubmit={handlePostJobSubmit} className="space-y-6">
                  {isPostSuccess ? (
                    <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/30 text-[#B8860B] text-center flex items-center justify-center space-x-2 font-bold text-sm">
                      <CheckCircle size={18} />
                      <span>
                        {currentUser.role === 'admin'
                          ? 'Đăng tuyển thành công! Tin tuyển dụng đã được xuất bản công khai.'
                          : 'Đăng tuyển thành công! Tin tuyển dụng của bạn đang chờ Admin duyệt.'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Tên công việc *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: HRBP Lead"
                            value={newJobForm.title}
                            onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          />
                        </div>
                        {/* Company */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Công ty tuyển dụng *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Job Service"
                            value={newJobForm.company}
                            onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          />
                        </div>
                        {/* Salary */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Mức lương *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: 30,000,000 - 40,000,000 VND"
                            value={newJobForm.salary}
                            onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          />
                        </div>
                        {/* Location */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Địa điểm làm việc</label>
                          <select
                            value={newJobForm.location}
                            onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          >
                            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Toàn quốc">Toàn quốc</option>
                          </select>
                        </div>
                        {/* Level */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Cấp bậc</label>
                          <select
                            value={newJobForm.level}
                            onChange={(e) => setNewJobForm({ ...newJobForm, level: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          >
                            <option value="Senior">Senior</option>
                            <option value="Manager">Manager</option>
                            <option value="Director">Director</option>
                            <option value="Junior / Middle">Junior / Middle</option>
                          </select>
                        </div>
                        {/* Type */}
                        <div className="flex flex-col space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">Hình thức</label>
                          <select
                            value={newJobForm.type}
                            onChange={(e) => setNewJobForm({ ...newJobForm, type: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Từ khóa kỹ năng (Ngăn cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Headhunting, Sourcing, Compensation & Benefits"
                          value={newJobForm.skills}
                          onChange={(e) => setNewJobForm({ ...newJobForm, skills: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                        />
                      </div>

                      {/* Headhunt checkbox */}
                      <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-sm">
                        <input
                          type="checkbox"
                          id="isHeadhunt"
                          checked={newJobForm.isHeadhunt}
                          onChange={(e) => setNewJobForm({ ...newJobForm, isHeadhunt: e.target.checked })}
                          className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                        />
                        <label htmlFor="isHeadhunt" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
                          Đây là tin tuyển dụng Headhunt (Có phí giới thiệu ứng viên)
                        </label>
                      </div>

                      {/* Referral Commission input */}
                      {newJobForm.isHeadhunt && (
                        <div className="flex flex-col space-y-1.5 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#FDFBF7]">
                          <label className="text-xs font-bold text-gray-700">Phí giới thiệu ứng viên (VND hoặc % hoa hồng) *</label>
                          <input
                            type="text"
                            required={newJobForm.isHeadhunt}
                            placeholder="Ví dụ: 3,000,000 - 5,000,000 VND hoặc 15% hoa hồng"
                            value={newJobForm.referralCommission}
                            onChange={(e) => setNewJobForm({ ...newJobForm, referralCommission: e.target.value })}
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Mô tả công việc *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="- Thực hiện các nhiệm vụ chuyên môn..."
                          value={newJobForm.description}
                          onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold resize-none bg-white"
                        />
                      </div>

                      {/* Requirements */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Yêu cầu công việc *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="- Có ít nhất 3 năm kinh nghiệm ở vị trí tương đương..."
                          value={newJobForm.requirements}
                          onChange={(e) => setNewJobForm({ ...newJobForm, requirements: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold resize-none bg-white"
                        />
                      </div>

                      {/* Benefits */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Quyền lợi *</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="- Lương tháng 13 + KPIs thưởng hấp dẫn..."
                          value={newJobForm.benefits}
                          onChange={(e) => setNewJobForm({ ...newJobForm, benefits: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold resize-none bg-white"
                        />
                      </div>

                      {/* Working Time */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Thời gian làm việc *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Thứ 2 - Thứ 6 (8:00 - 17:30)"
                          value={newJobForm.workingTime}
                          onChange={(e) => setNewJobForm({ ...newJobForm, workingTime: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                        />
                      </div>

                      {/* Working Address */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Địa chỉ làm việc *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh"
                          value={newJobForm.workingAddress}
                          onChange={(e) => setNewJobForm({ ...newJobForm, workingAddress: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md"
                      >
                        Đăng tuyển việc làm
                      </button>
                    </>
                  )}
                </form>
              )}
            </MotionDiv>
          )}

          {/* Job List */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#D4AF37]/20 rounded-3xl bg-[#FDFBF7]">
              <p className="text-sm font-bold text-gray-500">Không tìm thấy tin tuyển dụng nào phù hợp với bộ lọc.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredJobs.map((job) => (
                <MotionDiv
                  key={job.id}
                  layoutId={job.id}
                  className="card-premium p-6 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Status Indicator */}
                  {!job.approved && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                      Chờ duyệt
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="pr-12">
                        <h4 
                          onClick={() => handleOpenDetail(job)}
                          className="text-lg font-black text-gray-900 hover:text-[#D4AF37] transition-colors leading-snug cursor-pointer"
                        >
                          {job.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            {job.company}
                          </span>
                          {job.skills.some(s => s.toLowerCase() === 'headhunt') && (
                            <span className="bg-[#D4AF37] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                              Headhunt
                            </span>
                          )}
                        </div>
                      </div>
                      {job.approved && (
                        <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2.5 py-1 rounded-md flex-shrink-0">
                          {job.level}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="space-y-2 text-xs font-bold text-gray-600 mb-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign size={14} className="text-[#D4AF37]" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-[#D4AF37]" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase size={14} className="text-[#D4AF37]" />
                        <span>Hình thức: {job.type}</span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="flex-grow py-2.5 rounded-xl bg-gray-900 hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Ứng tuyển ngay
                      </button>
                      <button
                        onClick={() => handleOpenDetail(job)}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 hover:border-gray-500 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Chi tiết
                      </button>
                    </div>

                    {/* Admin management buttons */}
                    {currentUser?.role === 'admin' && (
                      <div className="flex justify-end space-x-2 border-t border-gray-50 pt-2">
                        {!job.approved && (
                          <button
                            onClick={() => handleApproveJob(job.id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#B8860B] text-[10px] font-black uppercase rounded-lg transition-colors"
                            title="Phê duyệt"
                          >
                            <Check size={11} />
                            <span>Duyệt</span>
                          </button>
                        )}
                        <button
                          onClick={() => startEditJob(job)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={11} />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={11} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    )}
                  </div>
                </MotionDiv>
              ))}
            </div>
          )}
        </div>
      </section>
      </>
      )}

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl border border-[#D4AF37]/20 shadow-2xl p-6 md:p-8 relative overflow-hidden"
          >
            <button
              onClick={() => {
                setSelectedJob(null);
                setIsApplySuccess(false);
                setApplyFallbackMailto('');
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {isApplySuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/30 flex items-center justify-center text-[#B8860B] shadow-md">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Nộp Hồ Sơ Thành Công!</h3>
                <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Cảm ơn bạn đã nộp hồ sơ vào vị trí <strong>{selectedJob.title}</strong>. Đại diện cộng đồng sẽ liên hệ lại bạn trong thời gian sớm nhất.
                </p>
                {applyFallbackMailto && (
                  <div className="pt-4 border-t border-gray-100 mt-4 w-full px-4">
                    <p className="text-[11px] text-amber-700 font-semibold mb-3 leading-relaxed">
                      Do máy chủ chưa cấu hình gửi email tự động, vui lòng nhấn nút dưới đây để gửi CV và thông tin ứng tuyển của bạn đến Nhà tuyển dụng qua ứng dụng email:
                    </p>
                    <a
                      href={applyFallbackMailto}
                      onClick={() => {
                        setApplyFallbackMailto('');
                        setSelectedJob(null);
                        setIsApplySuccess(false);
                      }}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-[#B8860B] hover:bg-[#D4AF37] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md space-x-2"
                    >
                      <Send size={12} />
                      <span>Gửi Email Ứng Tuyển Ngay</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
                  <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                    {applyType === 'refer' ? 'Giới thiệu ứng viên (Nhận hoa hồng)' : 'Ứng tuyển việc làm'}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-2">{selectedJob.title}</h3>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedJob.company}</span>
                </div>

                {selectedJob.skills.some(s => s.toLowerCase() === 'headhunt') && (
                  <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                      type="button"
                      onClick={() => setApplyType('apply')}
                      className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                        applyType === 'apply'
                          ? 'bg-white text-[#B8860B] shadow-sm'
                          : 'text-gray-500 hover:text-gray-950'
                      }`}
                    >
                      Tự ứng tuyển
                    </button>
                    <button
                      type="button"
                      onClick={() => setApplyType('refer')}
                      className={`w-1/2 py-2 rounded-lg text-xs font-bold transition-all ${
                        applyType === 'refer'
                          ? 'bg-white text-[#B8860B] shadow-sm'
                          : 'text-gray-500 hover:text-gray-950'
                      }`}
                    >
                      Giới thiệu ứng viên
                    </button>
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {applyType === 'refer' && (
                    <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#D4AF37]/20 space-y-3 shadow-sm mb-4">
                      <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider block">
                        Thông tin người giới thiệu (Đối tác)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700">Họ và tên của bạn *</label>
                          <input
                            type="text"
                            required
                            placeholder="Nguyễn Văn A"
                            value={referrerForm.referrerName}
                            onChange={(e) => setReferrerForm({ ...referrerForm, referrerName: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700">Số điện thoại *</label>
                          <input
                            type="tel"
                            required
                            placeholder="0987654321"
                            value={referrerForm.referrerPhone}
                            onChange={(e) => setReferrerForm({ ...referrerForm, referrerPhone: e.target.value })}
                            className="px-3 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700">Địa chỉ Email của bạn *</label>
                        <input
                          type="email"
                          required
                          placeholder="partner@example.com"
                          value={referrerForm.referrerEmail}
                          onChange={(e) => setReferrerForm({ ...referrerForm, referrerEmail: e.target.value })}
                          className="px-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {applyType === 'refer' && (
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block pt-2 border-t border-gray-100">
                      Thông tin ứng viên được giới thiệu
                    </span>
                  )}

                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700">Họ và tên ứng viên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn B"
                      value={applyForm.fullName}
                      onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                    />
                  </div>
                  
                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Email ứng viên *</label>
                      <input
                        type="email"
                        required
                        placeholder="candidate@example.com"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Số điện thoại ứng viên *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0987654321"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                  </div>

                  {/* Upload CV field */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700">Tải lên tệp CV ứng viên (PDF, Word) *</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setApplyForm(prev => ({
                                ...prev,
                                cvLink: reader.result as string
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white cursor-pointer"
                    />
                    {applyForm.cvLink && applyForm.cvLink.startsWith('data:') && (
                      <span className="text-[10px] text-green-600 font-bold block mt-1">✓ Đã tải tệp CV thành công</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md flex items-center justify-center space-x-2 mt-4"
                  >
                    <Send size={14} />
                    <span>{applyType === 'refer' ? 'Gửi thông tin giới thiệu' : 'Nộp hồ sơ ứng tuyển'}</span>
                  </button>
                </form>
              </>
            )}
          </MotionDiv>
        </div>
      )}

      {/* Edit Job Modal (Admin only) */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl border border-[#D4AF37]/20 shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setEditingJob(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-lg font-black text-gray-900">Chỉnh sửa tin tuyển dụng</h3>
              <span className="text-xs text-gray-500">Mã tin: {editingJob.id}</span>
            </div>

            <form onSubmit={handleEditJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Tên công việc *</label>
                  <input
                    type="text"
                    required
                    value={editJobForm.title}
                    onChange={(e) => setEditJobForm({ ...editJobForm, title: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Công ty *</label>
                  <input
                    type="text"
                    required
                    value={editJobForm.company}
                    onChange={(e) => setEditJobForm({ ...editJobForm, company: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Mức lương *</label>
                  <input
                    type="text"
                    required
                    value={editJobForm.salary}
                    onChange={(e) => setEditJobForm({ ...editJobForm, salary: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Địa điểm *</label>
                  <select
                    value={editJobForm.location}
                    onChange={(e) => setEditJobForm({ ...editJobForm, location: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Toàn quốc">Toàn quốc</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Cấp bậc *</label>
                  <select
                    value={editJobForm.level}
                    onChange={(e) => setEditJobForm({ ...editJobForm, level: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="Junior / Middle">Junior / Middle</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hình thức *</label>
                  <select
                    value={editJobForm.type}
                    onChange={(e) => setEditJobForm({ ...editJobForm, type: e.target.value })}
                    className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Từ khóa kỹ năng *</label>
                <input
                  type="text"
                  required
                  value={editJobForm.skills}
                  onChange={(e) => setEditJobForm({ ...editJobForm, skills: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                />
              </div>

              {/* Headhunt checkbox */}
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/25 shadow-sm">
                <input
                  type="checkbox"
                  id="editIsHeadhunt"
                  checked={editJobForm.isHeadhunt}
                  onChange={(e) => setEditJobForm({ ...editJobForm, isHeadhunt: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                />
                <label htmlFor="editIsHeadhunt" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
                  Đây là tin tuyển dụng Headhunt (Có phí giới thiệu ứng viên)
                </label>
              </div>

              {/* Referral Commission input */}
              {editJobForm.isHeadhunt && (
                <div className="flex flex-col space-y-1.5 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#FDFBF7]">
                  <label className="text-xs font-bold text-gray-700">Phí giới thiệu ứng viên (VND hoặc % hoa hồng) *</label>
                  <input
                    type="text"
                    required={editJobForm.isHeadhunt}
                    placeholder="Ví dụ: 3,000,000 - 5,000,000 VND hoặc 15% hoa hồng"
                    value={editJobForm.referralCommission}
                    onChange={(e) => setEditJobForm({ ...editJobForm, referralCommission: e.target.value })}
                    className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                  />
                </div>
              )}

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Mô tả công việc *</label>
                <textarea
                  rows={4}
                  required
                  value={editJobForm.description}
                  onChange={(e) => setEditJobForm({ ...editJobForm, description: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold resize-none bg-white"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Yêu cầu công việc *</label>
                <textarea
                  rows={4}
                  required
                  value={editJobForm.requirements}
                  onChange={(e) => setEditJobForm({ ...editJobForm, requirements: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold resize-none bg-white"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Quyền lợi *</label>
                <textarea
                  rows={4}
                  required
                  value={editJobForm.benefits}
                  onChange={(e) => setEditJobForm({ ...editJobForm, benefits: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold resize-none bg-white"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Thời gian làm việc *</label>
                <input
                  type="text"
                  required
                  value={editJobForm.workingTime}
                  onChange={(e) => setEditJobForm({ ...editJobForm, workingTime: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Địa chỉ làm việc *</label>
                <input
                  type="text"
                  required
                  value={editJobForm.workingAddress}
                  onChange={(e) => setEditJobForm({ ...editJobForm, workingAddress: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold bg-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </MotionDiv>
        </div>
      )}

      {/* CV Applications Modal (Admin & Partner only) */}
      {showApplicationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-white rounded-3xl border border-[#D4AF37]/20 shadow-2xl p-6 md:p-8 relative overflow-hidden max-h-[85vh] flex flex-col"
          >
            <button
              onClick={() => setShowApplicationsModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6 flex-shrink-0">
              <h3 className="text-xl font-black text-gray-900 flex items-center space-x-2">
                <FileText className="text-[#D4AF37]" size={22} />
                <span>Danh sách CV ứng viên ứng tuyển</span>
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                {currentUser?.role === 'admin'
                  ? 'Ban quản trị có quyền xem tất cả CV ứng tuyển trong hệ thống.'
                  : 'Partner có quyền xem CV ứng tuyển cho các tin tuyển dụng do mình đăng.'}
              </p>
            </div>

            {/* List Table container */}
            <div className="flex-grow overflow-y-auto min-h-[300px] border border-gray-100 rounded-2xl pr-1">
              {visibleApplications.length === 0 ? (
                <div className="text-center py-20">
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
                    {visibleApplications.map((app) => (
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
                            <a
                              href={app.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="block text-[#0077B5] hover:underline text-[10px] font-bold"
                            >
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

            <div className="border-t border-gray-100 pt-4 mt-6 flex-shrink-0 flex justify-end">
              <button
                onClick={() => setShowApplicationsModal(false)}
                className="px-6 py-2.5 bg-gray-900 hover:bg-[#D4AF37] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </MotionDiv>
        </div>
      )}

    </div>
  );
}

interface JobDetailViewProps {
  job: Job;
  onClose: () => void;
  onApply: (type: 'apply' | 'refer') => void;
  savedJobIds: string[];
  onSave: (id: string) => void;
}

function JobDetailView({ job, onClose, onApply, savedJobIds, onSave }: JobDetailViewProps) {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/viec-lam?jobId=${job.id}`;
      navigator.clipboard.writeText(url)
        .then(() => alert('Đã sao chép liên kết chia sẻ tin tuyển dụng này!'))
        .catch(() => alert('Không thể sao chép liên kết. Hãy sao chép thủ công trên thanh địa chỉ.'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button & Share Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onClose}
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách việc làm</span>
        </button>
        
        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm"
        >
          <Share2 size={16} className="text-[#D4AF37]" />
          <span>Chia sẻ công việc</span>
        </button>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8"
      >
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column (Main JD & Title) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Job Title & Header Card */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-5">
              <div className="flex items-start space-x-3">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">
                  {job.title}
                </h2>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#D4AF37] text-white text-xs mt-1.5 flex-shrink-0" title="Đã xác thực">
                  ✓
                </span>
              </div>

              {/* 3 Quick Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Salary */}
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#B8860B]">
                    <DollarSign size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mức lương</span>
                    <span className="text-xs font-black text-gray-900">{job.salary}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Địa điểm</span>
                    <span className="text-xs font-black text-gray-900">{job.location}</span>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kinh nghiệm</span>
                    <span className="text-xs font-black text-gray-900">
                      {job.level === 'Senior' ? 'Trên 5 năm' : 
                       job.level === 'Manager' ? 'Trên 8 năm' : 
                       job.level === 'Director' ? 'Trên 10 năm' : '1 - 3 năm'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Market salary suggestion */}
              <div>
                <button 
                  onClick={() => alert(`Mức lương thị trường trung bình cho vị trí ${job.title} tại ${job.location} dao động từ 22,000,000 đến 48,000,000 VND/tháng.`)}
                  className="text-xs text-[#B8860B] hover:text-[#D4AF37] font-bold flex items-center space-x-1"
                >
                  <span>Xem mức lương thị trường cho vị trí này &gt;&gt;</span>
                </button>
              </div>

              {/* Application Counter & Deadline Alert Banner */}
              <div className="p-3.5 rounded-xl bg-[#FFF9E6] border border-[#FFE8A3] flex items-center justify-between text-xs text-yellow-800 font-bold flex-wrap gap-2">
                <span className="flex items-center space-x-1.5">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span>Xem số người đã ứng tuyển: <strong>12 người</strong></span>
                  <span className="bg-red-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded ml-1">New</span>
                </span>
                <span>Hạn nộp hồ sơ: 28/06/2026 (Còn 28 ngày)</span>
              </div>

              {/* Referral Commission Banner */}
              {(job.isHeadhunt || job.skills.some(s => s.toLowerCase() === 'headhunt')) && (
                <div className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#B8860B] font-bold">
                  <span className="flex items-center space-x-1.5">
                    <Award size={16} className="text-[#D4AF37]" />
                    <span>Phí giới thiệu ứng viên: <strong className="text-[#B8860B]">{job.referralCommission || 'Theo thỏa thuận'}</strong></span>
                  </span>
                  <span className="bg-[#D4AF37] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm">Hoa hồng</span>
                </div>
              )}

              {/* Action buttons (Ứng tuyển ngay / Tự ứng tuyển & Giới thiệu ứng viên & Lưu tin) */}
              <div className="flex flex-wrap gap-3 pt-2">
                {(job.isHeadhunt || job.skills.some(s => s.toLowerCase() === 'headhunt')) ? (
                  <>
                    <button
                      onClick={() => onApply('apply')}
                      className="flex-grow min-w-[140px] py-3 rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#B8860B] text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                    >
                      <Send size={14} />
                      <span>Tự ứng tuyển</span>
                    </button>
                    <button
                      onClick={() => onApply('refer')}
                      className="flex-grow min-w-[160px] py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-black uppercase tracking-wider transition-colors shadow flex items-center justify-center space-x-2"
                    >
                      <Users size={14} />
                      <span>Giới thiệu ứng viên</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onApply('apply')}
                    className="flex-grow py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-black uppercase tracking-wider transition-colors shadow flex items-center justify-center space-x-2"
                  >
                    <Send size={14} />
                    <span>Ứng tuyển ngay</span>
                  </button>
                )}

                <button
                  onClick={() => onSave(job.id)}
                  className={`px-6 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                    savedJobIds.includes(job.id)
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700 bg-white'
                  }`}
                >
                  <Heart size={14} className={savedJobIds.includes(job.id) ? "fill-red-600" : ""} />
                  <span>{savedJobIds.includes(job.id) ? 'Đã lưu' : 'Lưu tin'}</span>
                </button>
              </div>
            </div>

            {/* JD Content Container */}
            <div className="p-6 border border-gray-100 rounded-2xl space-y-6">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">
                Chi tiết tin tuyển dụng
              </h3>

              {/* Tags */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="text-gray-400 font-bold">Yêu cầu:</span>
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">
                    {job.level === 'Senior' ? 'Trên 5 năm kinh nghiệm chuyên môn' : 
                     job.level === 'Manager' ? 'Trên 8 năm kinh nghiệm chuyên môn' : 
                     job.level === 'Director' ? 'Trên 10 năm kinh nghiệm chuyên môn' : '1 - 3 năm kinh nghiệm chuyên môn'}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">Đại học trở lên</span>
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">Nam/Nữ</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-semibold items-center">
                  <span className="text-gray-400 font-bold">Chuyên môn:</span>
                  {job.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 text-xs font-semibold text-gray-700 leading-relaxed">
                <h4 className="text-sm font-black text-gray-900">Mô tả công việc</h4>
                <div className="space-y-2 whitespace-pre-line text-gray-600 font-medium bg-[#FDFBF7]/40 p-3.5 rounded-xl border border-[#D4AF37]/5 shadow-sm">
                  {job.description || 'Chưa cập nhật'}
                </div>

                <h4 className="text-sm font-black text-gray-900 pt-4">YÊU CẦU CÔNG VIỆC</h4>
                <div className="space-y-2 whitespace-pre-line text-gray-600 font-medium bg-[#FDFBF7]/40 p-3.5 rounded-xl border border-[#D4AF37]/5 shadow-sm">
                  {job.requirements || 'Chưa cập nhật'}
                </div>

                <h4 className="text-sm font-black text-gray-900 pt-4">QUYỀN LỢI ĐƯỢC HƯỞNG</h4>
                <div className="space-y-2 whitespace-pre-line text-gray-600 font-medium bg-[#FDFBF7]/40 p-3.5 rounded-xl border border-[#D4AF37]/5 shadow-sm">
                  {job.benefits || 'Chưa cập nhật'}
                </div>

                {(job.workingTime || job.workingAddress) && (
                  <>
                    <h4 className="text-sm font-black text-gray-900 pt-4">THỜI GIAN & ĐỊA ĐIỂM LÀM VIỆC</h4>
                    <div className="space-y-2 text-gray-600 font-medium bg-[#FDFBF7]/40 p-3.5 rounded-xl border border-[#D4AF37]/5 shadow-sm font-semibold">
                      {job.workingTime && (
                        <p className="flex items-center space-x-1.5"><span className="text-gray-400 font-bold">Thời gian:</span> <span className="text-gray-700 font-medium">{job.workingTime}</span></p>
                      )}
                      {job.workingAddress && (
                        <p className="flex items-start space-x-1.5"><span className="text-gray-400 font-bold flex-shrink-0">Địa chỉ:</span> <span className="text-gray-700 font-medium">{job.workingAddress}</span></p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Company & Common Info) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Company Box */}
            <div className="p-6 rounded-2xl border border-gray-100 space-y-4 bg-white shadow-sm text-left">
              <div className="flex items-center space-x-3.5 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center bg-gray-50 text-[#B8860B] font-extrabold text-sm flex-shrink-0 shadow-inner">
                  {job.company.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-black text-gray-900 leading-snug">
                    {job.company}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-bold block mt-1">Đã xác minh thông tin</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-gray-600 font-medium">
                <li className="flex justify-between">
                  <span className="text-gray-400 font-bold">Quy mô:</span>
                  <span className="text-gray-900 font-black">100 - 500 nhân viên</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400 font-bold">Lĩnh vực:</span>
                  <span className="text-gray-900 font-black">Tuyển dụng / Nhân sự</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400 font-bold">Địa điểm:</span>
                  <span className="text-gray-900 font-black">{job.location}</span>
                </li>
              </ul>

              <button
                onClick={() => alert(`Đang tải trang hồ sơ công ty ${job.company}...`)}
                className="w-full py-2.5 rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#B8860B] text-[11px] font-black transition-all text-center block uppercase tracking-wider"
              >
                Xem trang công ty
              </button>
            </div>

            {/* General Info Box */}
            <div className="p-6 rounded-2xl border border-gray-100 space-y-4 bg-white shadow-sm text-left">
              <h4 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">
                Thông tin chung
              </h4>

              <ul className="space-y-3.5 text-xs font-semibold text-gray-600 font-medium">
                <li className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Cấp bậc:</span>
                  <span className="text-gray-900 font-black">{job.level}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Học vấn:</span>
                  <span className="text-gray-900 font-black">Đại học trở lên</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Số lượng tuyển:</span>
                  <span className="text-gray-900 font-black">1 người</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">Loại hình làm việc:</span>
                  <span className="text-gray-900 font-black">{job.type}</span>
                </li>
              </ul>
            </div>

            {/* Related Categories */}
            <div className="p-6 rounded-2xl border border-gray-100 space-y-4 bg-white shadow-sm text-left">
              <h4 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">
                Danh mục Nghề liên quan
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Nhân sự / Hành chính
                </span>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Tuyển dụng / Headhunt
                </span>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  HRBP Partner
                </span>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
