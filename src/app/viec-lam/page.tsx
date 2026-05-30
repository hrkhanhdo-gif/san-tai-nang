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
  FileText
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
  const [isApplySuccess, setIsApplySuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    cvLink: ''
  });

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
    description: ''
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
    description: ''
  });

  // CV Applications Modal
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      setCurrentUser(dbHelper.getCurrentUser());
      
      const jobsData = await dbHelper.getJobs();
      setJobs(jobsData);
      
      const appsData = await dbHelper.getApplications();
      setApplications(appsData);
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

  // Submit Application (Save CV)
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const newApp = await dbHelper.addApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      fullName: applyForm.fullName,
      email: applyForm.email,
      phone: applyForm.phone,
      linkedin: applyForm.linkedin,
      cvLink: applyForm.cvLink
    });

    setApplications((prev) => [newApp, ...prev]);
    setIsApplySuccess(true);
    setApplyForm({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      cvLink: ''
    });

    setTimeout(() => {
      setSelectedJob(null);
      setIsApplySuccess(false);
    }, 2500);
  };

  // Submit Posted Job
  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const skillsArray = newJobForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const jobPayload = {
      title: newJobForm.title,
      company: newJobForm.company,
      salary: newJobForm.salary,
      location: newJobForm.location,
      level: newJobForm.level,
      type: newJobForm.type,
      skills: skillsArray.length > 0 ? skillsArray : ['Tuyển dụng', 'HR'],
      description: newJobForm.description
    };

    const approveImmediately = currentUser.role === 'admin';
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
      description: ''
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
      description: job.description || ''
    });
  };

  const handleEditJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const skillsArray = editJobForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedPayload = {
      title: editJobForm.title,
      company: editJobForm.company,
      salary: editJobForm.salary,
      location: editJobForm.location,
      level: editJobForm.level,
      type: editJobForm.type,
      skills: skillsArray.length > 0 ? skillsArray : ['Tuyển dụng', 'HR'],
      description: editJobForm.description
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
            Khám phá các vị trí tuyển dụng HRBP, TA, HR Manager, Headhunter và CHRO cao cấp từ các tập đoàn và doanh nghiệp đối tác uy tín toàn quốc.
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
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center flex items-center justify-center space-x-2 font-bold text-sm">
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
                            placeholder="Ví dụ: Job Service Connect"
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

                      {/* Description */}
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Mô tả công việc vắn tắt</label>
                        <textarea
                          rows={3}
                          placeholder="Ví dụ: Chịu trách nhiệm tìm kiếm các ứng viên IT, thiết lập chiến lược tuyển dụng..."
                          value={newJobForm.description}
                          onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold resize-none bg-white"
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
                        <h4 className="text-lg font-black text-gray-900 hover:text-[#D4AF37] transition-colors leading-snug">
                          {job.title}
                        </h4>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mt-1">
                          {job.company}
                        </span>
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
                        onClick={() => {
                          alert(job.description || 'Chức năng chi tiết đang được xây dựng...');
                        }}
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
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-lg transition-colors"
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

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl border border-[#D4AF37]/20 shadow-2xl p-6 md:p-8 relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {isApplySuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-md">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Nộp Hồ Sơ Thành Công!</h3>
                <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-xs mx-auto">
                  Cảm ơn bạn đã nộp hồ sơ vào vị trí <strong>{selectedJob.title}</strong>. Đại diện cộng đồng sẽ liên hệ lại bạn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <>
                <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
                  <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                    Ứng tuyển việc làm
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-2">{selectedJob.title}</h3>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedJob.company}</span>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={applyForm.fullName}
                      onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                    />
                  </div>
                  
                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
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

                  {/* LinkedIn Profile */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700">Link LinkedIn cá nhân</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={applyForm.linkedin}
                      onChange={(e) => setApplyForm({ ...applyForm, linkedin: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                    />
                  </div>

                  {/* CV Link */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-700">Đường dẫn tệp CV (Drive, Dropbox, PDF...)</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={applyForm.cvLink}
                      onChange={(e) => setApplyForm({ ...applyForm, cvLink: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md flex items-center justify-center space-x-2"
                  >
                    <Send size={14} />
                    <span>Nộp hồ sơ ứng tuyển</span>
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

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-700">Mô tả chi tiết *</label>
                <textarea
                  rows={4}
                  required
                  value={editJobForm.description}
                  onChange={(e) => setEditJobForm({ ...editJobForm, description: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] text-xs font-semibold resize-none bg-white"
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
                          <span className="font-black text-gray-900 block">{app.fullName}</span>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="block text-[11px]">{app.email}</span>
                          <span className="block text-[11px] text-gray-400">{app.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-gray-900 block leading-tight">{app.jobTitle}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">{app.company}</span>
                        </td>
                        <td className="p-4 space-y-2">
                          {app.cvLink && (
                            <a
                              href={app.cvLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-[#B8860B] hover:underline text-[11px] font-bold"
                            >
                              <Eye size={12} />
                              <span>Mở CV cá nhân</span>
                            </a>
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
