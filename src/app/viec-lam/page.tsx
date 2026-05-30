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
  Lock, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { dbHelper, Job } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Modal State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplySuccess, setIsApplySuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    cvLink: ''
  });

  // Admin State (To post new jobs)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
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

  // Load jobs on mount
  useEffect(() => {
    async function loadData() {
      const data = await dbHelper.getJobs();
      setJobs(data);
      setFilteredJobs(data);
    }
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = jobs;

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      result = result.filter((j) => j.location.includes(selectedLocation));
    }

    // Level filter
    if (selectedLevel !== 'all') {
      result = result.filter((j) => j.level.toLowerCase() === selectedLevel.toLowerCase());
    }

    // Working Type filter
    if (selectedType !== 'all') {
      result = result.filter((j) => j.type.toLowerCase() === selectedType.toLowerCase());
    }

    setFilteredJobs(result);
  }, [searchQuery, selectedLocation, selectedLevel, selectedType, jobs]);

  // Apply Submit
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsApplySuccess(true);
      setApplyForm({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        cvLink: ''
      });
      // Auto close after 3s
      setTimeout(() => {
        setSelectedJob(null);
        setIsApplySuccess(false);
      }, 3000);
    }, 500);
  };

  // Admin Login
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // Simple mockup passcode
      setIsPasswordCorrect(true);
    } else {
      alert('Mật khẩu quản trị viên không chính xác (Thử: admin123)');
    }
  };

  // Post Job Submit
  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const addedJob = await dbHelper.addJob(jobPayload);
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
      setIsAdminMode(false);
      setIsPasswordCorrect(false);
      setAdminPassword('');
    }, 3000);
  };

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

            {/* Admin Post Trigger */}
            <div className="flex justify-between items-center border-t border-[#D4AF37]/10 pt-4 flex-wrap gap-4">
              <span className="text-xs text-gray-500 font-bold flex items-center space-x-1.5">
                <Clock size={14} className="text-[#D4AF37]" />
                <span>Hiển thị {filteredJobs.length} tin tuyển dụng phù hợp</span>
              </span>
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="flex items-center space-x-2 text-xs font-black uppercase text-[#B8860B] hover:text-[#D4AF37] transition-colors"
              >
                <PlusCircle size={15} />
                <span>Đăng tin tuyển dụng (Admin)</span>
              </button>
            </div>
          </div>

          {/* Admin Posting Section Panel */}
          {isAdminMode && (
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-8 rounded-3xl bg-white border-2 border-dashed border-[#D4AF37]/30 shadow-lg mb-12 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-4 mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
                  <Lock size={18} className="text-[#D4AF37]" />
                  <span>Xác thực Quản trị viên</span>
                </h3>
                <button onClick={() => setIsAdminMode(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {!isPasswordCorrect ? (
                <form onSubmit={handleAdminVerify} className="max-w-md space-y-4">
                  <p className="text-xs text-gray-500 font-bold">
                    Vui lòng điền mật khẩu quản trị viên để mở khóa form đăng cơ hội việc làm mới. (Mật khẩu mặc định: <span className="text-[#D4AF37]">admin123</span>)
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Mật khẩu..."
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="flex-grow px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Mở khóa
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePostJobSubmit} className="space-y-6">
                  {isPostSuccess ? (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center flex items-center justify-center space-x-2 font-bold text-sm">
                      <CheckCircle size={18} />
                      <span>Đăng tin tuyển dụng thành công! Tin sẽ hiển thị ngay lập tức.</span>
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
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold"
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
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold"
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
                            className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold"
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
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold"
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
                          className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold resize-none"
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
                  className="card-premium p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-black text-gray-900 hover:text-[#D4AF37] transition-colors leading-snug">
                          {job.title}
                        </h4>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mt-1">
                          {job.company}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2.5 py-1 rounded-md">
                        {job.level}
                      </span>
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
                  <div className="flex gap-2 border-t border-gray-100 pt-4">
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
            {/* Top Close Button */}
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
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-sm font-semibold"
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
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
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
                        className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
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
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
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
                      className="px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold"
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
    </div>
  );
}
