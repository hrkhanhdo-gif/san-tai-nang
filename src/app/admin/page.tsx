'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Briefcase, Check, X, Edit, Trash2, Camera, Upload, 
  Settings, LayoutDashboard, Home, ArrowLeft, Plus, PlusCircle, CheckCircle, Zap
} from 'lucide-react';
import { dbHelper, UserSession, Member, JobApplication, OrgMember, HonoredMember, SystemSettings, CommunityActivity, compressImage } from '@/lib/supabase';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'join' | 'members' | 'applications' | 'content'>('join');
  const [contentSubTab, setContentSubTab] = useState<'org' | 'honored' | 'activity' | 'homepage' | 'thuanhn'>('org');

  const [members, setMembers] = useState<Member[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [honoredMembers, setHonoredMembers] = useState<HonoredMember[]>([]);
  const [settingsForm, setSettingsForm] = useState<SystemSettings>({});

  // Activities CMS state
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isAdminPostSuccess, setIsAdminPostSuccess] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'Workshop' as 'Workshop' | 'Networking' | 'Seminar' | 'Sự kiện',
    description: '',
    date: '',
    attendees: 50,
    imageType: 'books' as 'books' | 'handshake' | 'briefcase' | 'target' | 'party' | 'coffee',
    images: [] as string[],
    showOnHomepage: false
  });

  // Org member form state
  const [orgForm, setOrgForm] = useState({
    id: '',
    name: '',
    role: '',
    company: '',
    image: '',
    roleType: 'member' as 'founder' | 'admin' | 'leader' | 'member',
    department: '',
    parentLeaderId: ''
  });
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  useEffect(() => {
    // Check if client-side
    const user = dbHelper.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);

    if (user && user.role === 'admin') {
      loadData();
    }
  }, []);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeStatus, setOptimizeStatus] = useState('');

  const handleOptimizeDatabaseImages = async () => {
    if (!confirm('Bạn có chắc chắn muốn quét và tối ưu hóa dung lượng hình ảnh hiện có trong database không? Quá trình này có thể tốn vài phút tùy thuộc vào lượng ảnh đang lưu.')) {
      return;
    }

    setIsOptimizing(true);
    try {
      // 1. Sơ đồ tổ chức
      setOptimizeStatus('Đang quét ảnh Sơ đồ tổ chức...');
      const orgData = await dbHelper.getOrgMembers();
      let orgOptimized = 0;
      for (const m of orgData) {
        if (m.image && m.image.startsWith('data:image/')) {
          setOptimizeStatus(`Nén ảnh sơ đồ tổ chức: ${m.name}...`);
          const compressed = await compressImage(m.image, 800, 800, 0.7);
          if (compressed !== m.image) {
            await dbHelper.saveOrgMember({ ...m, image: compressed });
            orgOptimized++;
          }
        }
      }

      // 2. Vinh danh
      setOptimizeStatus('Đang quét ảnh Vinh danh...');
      const honoredData = await dbHelper.getHonoredMembers();
      let honoredOptimized = 0;
      for (const m of honoredData) {
        if (m.image && m.image.startsWith('data:image/')) {
          setOptimizeStatus(`Nén ảnh vinh danh...`);
          const compressed = await compressImage(m.image, 1000, 1000, 0.7);
          if (compressed !== m.image) {
            await dbHelper.saveHonoredMember({ ...m, image: compressed });
            honoredOptimized++;
          }
        }
      }

      // 3. Hoạt động
      setOptimizeStatus('Đang quét bài viết hoạt động...');
      const activitiesData = await dbHelper.getActivities();
      let activitiesOptimized = 0;
      for (const act of activitiesData) {
        if (act.images && act.images.length > 0) {
          setOptimizeStatus(`Nén ảnh bài viết: ${act.title}...`);
          let changed = false;
          const compressedImages = await Promise.all(
            act.images.map(async (img) => {
              if (img.startsWith('data:image/')) {
                const comp = await compressImage(img, 1000, 1000, 0.7);
                if (comp !== img) {
                  changed = true;
                  return comp;
                }
              }
              return img;
            })
          );
          if (changed) {
            await dbHelper.updateActivity(act.id, { images: compressedImages });
            activitiesOptimized++;
          }
        }
      }

      // 4. Cấu hình hệ thống
      setOptimizeStatus('Đang quét cấu hình hệ thống...');
      const settings = await dbHelper.getSystemSettings();
      let settingsChanged = false;
      const optimizedSettings = { ...settings };
      if (settings.homepageBannerImage && settings.homepageBannerImage.startsWith('data:image/')) {
        const comp = await compressImage(settings.homepageBannerImage, 1200, 1200, 0.75);
        if (comp !== settings.homepageBannerImage) {
          optimizedSettings.homepageBannerImage = comp;
          settingsChanged = true;
        }
      }
      if (settings.founder1_image && settings.founder1_image.startsWith('data:image/')) {
        const comp = await compressImage(settings.founder1_image, 600, 600, 0.7);
        if (comp !== settings.founder1_image) {
          optimizedSettings.founder1_image = comp;
          settingsChanged = true;
        }
      }
      if (settings.founder2_image && settings.founder2_image.startsWith('data:image/')) {
        const comp = await compressImage(settings.founder2_image, 600, 600, 0.7);
        if (comp !== settings.founder2_image) {
          optimizedSettings.founder2_image = comp;
          settingsChanged = true;
        }
      }
      if (settings.founder3_image && settings.founder3_image.startsWith('data:image/')) {
        const comp = await compressImage(settings.founder3_image, 600, 600, 0.7);
        if (comp !== settings.founder3_image) {
          optimizedSettings.founder3_image = comp;
          settingsChanged = true;
        }
      }
      if (settings.thuanHn_image && settings.thuanHn_image.startsWith('data:image/')) {
        const comp = await compressImage(settings.thuanHn_image, 800, 800, 0.7);
        if (comp !== settings.thuanHn_image) {
          optimizedSettings.thuanHn_image = comp;
          settingsChanged = true;
        }
      }

      if (settingsChanged) {
        await dbHelper.saveSystemSettings(optimizedSettings);
      }

      setOptimizeStatus('Đang làm mới dữ liệu...');
      await loadData();
      alert(
        `Đã tối ưu hóa dữ liệu thành công!\n` +
        `- Sơ đồ tổ chức: ${orgOptimized} ảnh đã nén\n` +
        `- Vinh danh: ${honoredOptimized} ảnh đã nén\n` +
        `- Bài viết hoạt động: ${activitiesOptimized} bài viết đã nén\n` +
        `- Cấu hình hệ thống: ${settingsChanged ? 'Đã nén tối ưu' : 'Không có thay đổi'}`
      );
    } catch (e) {
      console.error(e);
      alert('Đã xảy ra lỗi khi tối ưu hóa: ' + String(e));
    } finally {
      setIsOptimizing(false);
      setOptimizeStatus('');
    }
  };

  async function loadData() {
    try {
      const [membersData, appsData, orgData, honoredData, settingsData, activitiesData] = await Promise.all([
        dbHelper.getMembers(),
        dbHelper.getApplications(),
        dbHelper.getOrgMembers(),
        dbHelper.getHonoredMembers(),
        dbHelper.getSystemSettings(),
        dbHelper.getActivities()
      ]);
      
      setMembers(membersData);
      setApplications(appsData);
      setOrgMembers(orgData);
      setHonoredMembers(honoredData);
      setSettingsForm(settingsData);
      setActivities(activitiesData);
    } catch (e) {
      console.error("Error loading admin data:", e);
    }
  }

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
      department: orgForm.roleType === 'leader' ? orgForm.department : undefined,
      parentLeaderId: orgForm.roleType === 'member' ? orgForm.parentLeaderId : undefined,
      created_at: new Date().toISOString()
    };
    await dbHelper.saveOrgMember(payload);
    const updated = await dbHelper.getOrgMembers();
    setOrgMembers(updated);
    setOrgForm({ id: '', name: '', role: '', company: '', image: '', roleType: 'member', department: '', parentLeaderId: '' });
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
      roleType: m.roleType,
      department: m.department || '',
      parentLeaderId: m.parentLeaderId || ''
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
  const handleMultiFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let loadedCount = 0;
    const itemsToSave: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result) {
          itemsToSave.push(reader.result as string);
        }
        loadedCount++;

        // Once all files are read, save them
        if (loadedCount === files.length) {
          for (const base64 of itemsToSave) {
            const payload: HonoredMember = {
              id: 'honored-' + Math.random().toString(36).substr(2, 9),
              image: base64,
              created_at: new Date().toISOString()
            };
            await dbHelper.saveHonoredMember(payload);
          }
          const updated = await dbHelper.getHonoredMembers();
          setHonoredMembers(updated);
          alert(`Đã tải lên thành công ${itemsToSave.length} hình ảnh vinh danh!`);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleDeleteHonoredMember = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn gỡ ảnh vinh danh này?')) {
      await dbHelper.deleteHonoredMember(id);
      const updated = await dbHelper.getHonoredMembers();
      setHonoredMembers(updated);
    }
  };

  // --- SYSTEM SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await dbHelper.saveSystemSettings(settingsForm);
    alert('Đã lưu cấu hình hệ thống thành công!');
    // Reload data to sync
    await loadData();
  };

  // --- APPROVE MEMBER HANDLER ---
  const handleApproveMember = async (member: Member) => {
    const updatedMember = { ...member, status: 'approved' as const };
    await dbHelper.saveMember(updatedMember);
    
    // Auto trigger email notification simulation
    try {
      const subjectText = "[JOB SERVICE] Thông báo phê duyệt hồ sơ gia nhập Cộng đồng Săn Tài Năng";
      const bodyText = `Chào ${member.fullName},\n\nHồ sơ gia nhập Cộng đồng Săn Tài Năng của bạn đã được phê duyệt thành công.\nDưới đây là thông tin đăng nhập của bạn:\nEmail: ${member.email}\nMật khẩu ban đầu: Matkhau123\n\nTrân trọng,\nBan Quản Trị JOB SERVICE`;
      
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: member.email,
          subject: subjectText,
          text: bodyText
        })
      });
    } catch (err) {
      console.error("Simulation email error", err);
    }

    const updated = await dbHelper.getMembers();
    setMembers(updated);
    alert(`Đã phê duyệt thành viên ${member.fullName} và gửi email thông báo tài khoản đăng nhập.`);
  };

  const handleDeclineMember = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn từ chối và xóa hồ sơ đăng ký này?')) {
      await dbHelper.deleteMember(id);
      const updated = await dbHelper.getMembers();
      setMembers(updated);
      alert('Đã xóa hồ sơ đăng ký.');
    }
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
      images: newActivity.images,
      showOnHomepage: newActivity.showOnHomepage
    };

    const added = await dbHelper.addActivity(payload);
    setActivities([added, ...activities]);
    setIsAdminPostSuccess(true);
    
    setNewActivity({
      title: '',
      category: 'Workshop',
      description: '',
      date: '',
      attendees: 50,
      imageType: 'books',
      images: [],
      showOnHomepage: false
    });

    setTimeout(() => {
      setIsAdminPostSuccess(false);
    }, 3000);
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết/hoạt động này?')) {
      await dbHelper.deleteActivity(id);
      setActivities(prev => prev.filter(a => a.id !== id));
      alert('Đã xóa bài viết/hoạt động.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[85vh] bg-[#FDFBF7]/40 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-white border border-red-100 rounded-3xl shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
            <X size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">Quyền truy cập bị từ chối</h2>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Bạn cần đăng nhập với tài khoản Ban Quản Trị (Admin) để sử dụng các tính năng cấu hình quản trị hệ thống.
          </p>
          <div className="pt-2">
            <Link
              href="/dang-nhap"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <span>Đi đến trang Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-150 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#B8860B] font-bold text-xs uppercase tracking-widest">
              <LayoutDashboard size={14} />
              <span>Hệ thống Quản trị</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mt-1.5 uppercase tracking-wide">
              ADMIN DASHBOARD
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition-colors"
            >
              <Home size={14} />
              <span>Xem Trang chủ</span>
            </Link>
            <Link
              href="/thanh-vien"
              className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Xem Sơ đồ / Vinh danh</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="bg-white border-b border-gray-100 flex space-x-6 justify-center md:justify-start px-6 max-w-7xl mx-auto flex-wrap">
        {[
          { id: 'join', label: 'Đơn đăng ký mới', icon: Users },
          { id: 'members', label: 'Thành viên cộng đồng', icon: Users },
          { id: 'applications', label: 'Đơn tuyển dụng', icon: Briefcase },
          { id: 'content', label: 'Quản lý nội dung (CMS)', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'join' | 'members' | 'applications' | 'content')}
              className={`py-4 flex items-center space-x-2 text-xs md:text-sm font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#D4AF37] text-[#D4AF37]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Banner tối ưu hóa cơ sở dữ liệu */}
        <div className="mb-6 bg-[#FDFBF7] p-5 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600 mt-0.5">
              <Zap size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Tối ưu hóa dung lượng hình ảnh cơ sở dữ liệu
              </h3>
              <p className="text-[10px] text-gray-500 font-semibold mt-1 leading-relaxed">
                Quét và tự động nén tất cả hình ảnh hiện tại trong cơ sở dữ liệu (sơ đồ tổ chức, vinh danh, bài viết, trang chủ) từ vài MB xuống vài chục KB. 
                Giúp hệ thống chạy cực nhanh và tránh đầy bộ nhớ Supabase.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleOptimizeDatabaseImages}
              disabled={isOptimizing}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all ${
                isOptimizing
                  ? 'bg-gray-150 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-[#D4AF37] text-white hover:bg-[#B8860B] border border-transparent'
              }`}
            >
              {isOptimizing ? `Đang tối ưu: ${optimizeStatus}` : 'Bắt đầu tối ưu hóa'}
            </button>
          </div>
        </div>
        
        {/* Tab 1: Pending join requests */}
        {activeTab === 'join' && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-base font-black text-gray-900 flex items-center space-x-2 uppercase tracking-wide">
                <span>Đơn đăng ký thành viên mới (Chờ duyệt)</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Phê duyệt hồ sơ đăng ký và cấp tài khoản ban đầu cho thành viên cộng đồng mới.
              </p>
            </div>

            <div className="overflow-x-auto">
              {members.filter(m => m.status === 'pending' || !m.status).length === 0 ? (
                <div className="text-center py-20 bg-gray-50/30 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400">Không có đơn đăng ký gia nhập nào đang chờ duyệt.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-155 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="p-4">Họ tên ứng viên</th>
                      <th className="p-4">Công ty & Chức danh</th>
                      <th className="p-4">Kinh nghiệm</th>
                      <th className="p-4">Liên hệ & LinkedIn</th>
                      <th className="p-4">Ngày đăng ký</th>
                      <th className="p-4 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                    {members.filter(m => m.status === 'pending' || !m.status).map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-black text-gray-900">{member.fullName}</td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800 block">{member.title}</span>
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
                              onClick={() => handleDeclineMember(member.id)}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-lg transition-colors"
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
          </section>
        )}

        {/* Tab 2: Approved community members list */}
        {activeTab === 'members' && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-base font-black text-gray-900 flex items-center space-x-2 uppercase tracking-wide">
                <span>Danh sách Thành viên Cộng đồng</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Các thành viên đã được phê duyệt hồ sơ và có quyền đăng bài hoạt động hoặc chia sẻ ứng viên.
              </p>
            </div>

            <div className="overflow-x-auto">
              {members.filter(m => m.status === 'approved').length === 0 ? (
                <div className="text-center py-20 bg-gray-50/30 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400">Chưa có thành viên cộng đồng nào được phê duyệt.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-155 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="p-4">Thành viên</th>
                      <th className="p-4">Công ty & Chức danh</th>
                      <th className="p-4">Liên hệ</th>
                      <th className="p-4 text-center">Trạng thái</th>
                      <th className="p-4 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                    {members.filter(m => m.status === 'approved').map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-black text-gray-900">{member.fullName}</td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800 block">{member.title}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{member.company}</span>
                        </td>
                        <td className="p-4">
                          <span className="block text-[11px]">{member.email}</span>
                          <span className="block text-[11px] text-gray-400">{member.phone}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                            Đang hoạt động
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleDeclineMember(member.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Hủy tư cách thành viên / Xóa"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Tab 3: Job applications */}
        {activeTab === 'applications' && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-base font-black text-gray-900 flex items-center space-x-2 uppercase tracking-wide">
                <span>Danh sách đơn ứng tuyển việc làm mới</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Các hồ sơ CV ứng tuyển do ứng viên tự nộp hoặc đối tác giới thiệu qua cổng tuyển dụng.
              </p>
            </div>

            <div className="overflow-x-auto">
              {applications.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/30 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400">Chưa có đơn ứng tuyển nào được gửi.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-155 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      <th className="p-4">Vị trí ứng tuyển</th>
                      <th className="p-4">Ứng viên</th>
                      <th className="p-4">Nguồn nộp</th>
                      <th className="p-4">Người giới thiệu (nếu có)</th>
                      <th className="p-4">Ngày nộp</th>
                      <th className="p-4">Liên kết CV</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-black text-[#B8860B]">{app.jobTitle}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-900 block">{app.fullName}</span>
                          <span className="text-[10px] text-gray-400 block">{app.email} | {app.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            app.isReferral 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                              : 'bg-green-50 text-green-700 border border-green-100'
                          }`}>
                            {app.isReferral ? 'Đối tác giới thiệu' : 'Tự ứng tuyển'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {app.isReferral ? (
                            <div>
                              <span className="font-bold block">{app.referrerName}</span>
                              <span className="text-[9px] text-gray-400 block">{app.referrerEmail}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Không có</span>
                          )}
                        </td>
                        <td className="p-4 text-[10px] text-gray-400">
                          {new Date(app.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4">
                          <a 
                            href={app.cvLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center space-x-1 text-xs text-[#B8860B] hover:underline font-bold"
                          >
                            <span>Xem hồ sơ</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* Tab 4: Quản lý nội dung (CMS) */}
        {activeTab === 'content' && (
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <div className="border-b border-[#D4AF37]/10 pb-4 mb-6">
              <h3 className="text-base font-black text-gray-900 flex items-center space-x-2 uppercase tracking-wide">
                <span>Quản lý nội dung hệ thống (CMS)</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                Tùy biến Sơ đồ tổ chức, Vinh danh thành viên, Banner và Lời chia sẻ trên Trang chủ, và Trang giới thiệu của CEO.
              </p>
            </div>

            {/* CMS Sub-tabs */}
            <div className="flex border-b border-gray-100 mb-8 space-x-2 overflow-x-auto pb-1">
              {[
                { id: 'org', label: 'Sơ đồ tổ chức' },
                { id: 'honored', label: 'Vinh danh thành viên' },
                { id: 'activity', label: 'Bài viết & Hoạt động' },
                { id: 'homepage', label: 'Cấu hình Trang chủ' },
                { id: 'thuanhn', label: 'Cấu hình CEO Hằng Nghĩa Thuận' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setContentSubTab(sub.id as 'org' | 'honored' | 'activity' | 'homepage' | 'thuanhn')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                    contentSubTab === sub.id
                      ? 'bg-[#D4AF37] text-white font-black shadow-sm'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* CMS Sub-tab 1: Sơ đồ tổ chức */}
            {contentSubTab === 'org' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add/Edit Form */}
                <div className="lg:col-span-1 bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/15 shadow-sm">
                  <h4 className="text-xs font-black text-gray-900 mb-4 uppercase tracking-wider">
                    {isEditingOrg ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                  </h4>
                  <form onSubmit={handleSaveOrgMember} className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Họ và tên *</label>
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
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Cấp bậc / Nhánh *</label>
                      <select
                        value={orgForm.roleType}
                        onChange={(e) => setOrgForm({ ...orgForm, roleType: e.target.value as 'founder' | 'admin' | 'leader' | 'member' })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                      >
                        <option value="founder">Founder / Co-Founder</option>
                        <option value="admin">Thư ký / Admin</option>
                        <option value="leader">Trưởng Ban</option>
                        <option value="member">Thành viên</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Công ty / Tổ chức</label>
                      <input
                        type="text"
                        value={orgForm.company}
                        onChange={(e) => setOrgForm({ ...orgForm, company: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Ví dụ: Job Service"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Chức danh / Vai trò *</label>
                      <input
                        type="text"
                        required
                        value={orgForm.role}
                        onChange={(e) => setOrgForm({ ...orgForm, role: e.target.value })}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        placeholder="Ví dụ: Trưởng ban điều hành"
                      />
                    </div>

                    {orgForm.roleType === 'leader' && (
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Tên Ban quản lý *</label>
                        <input
                          type="text"
                          required
                          value={orgForm.department}
                          onChange={(e) => setOrgForm({ ...orgForm, department: e.target.value })}
                          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                          placeholder="Ví dụ: Ban Tuyển dụng, Ban Truyền thông..."
                        />
                      </div>
                    )}

                    {orgForm.roleType === 'member' && (
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Trưởng Ban quản lý trực tiếp</label>
                        <select
                          value={orgForm.parentLeaderId}
                          onChange={(e) => setOrgForm({ ...orgForm, parentLeaderId: e.target.value })}
                          className="px-4 py-2 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        >
                          <option value="">-- Thành viên chung (Không có Trưởng Ban) --</option>
                          {orgMembers.filter(m => m.roleType === 'leader').map(leader => (
                            <option key={leader.id} value={leader.id}>
                              {leader.name} {leader.department ? `(${leader.department})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Hình ảnh đại diện</label>
                      <div className="flex items-center space-x-3 mt-1">
                        {orgForm.image ? (
                          <img
                            src={orgForm.image}
                            alt="Avatar preview"
                            className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/30"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-150 flex items-center justify-center text-gray-400">
                            <Camera size={16} />
                          </div>
                        )}
                        <label className="flex items-center space-x-1.5 px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl cursor-pointer text-gray-700 transition-colors">
                          <Upload size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Tải ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, (base64) => setOrgForm({ ...orgForm, image: base64 }))}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-sm"
                      >
                        Lưu thông tin
                      </button>
                      {isEditingOrg && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrgForm({ id: '', name: '', role: '', company: '', image: '', roleType: 'member', department: '', parentLeaderId: '' });
                            setIsEditingOrg(false);
                          }}
                          className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List Table of Org members */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">Danh sách thành viên hiện tại</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orgMembers.map((m) => (
                      <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start justify-between shadow-sm hover:border-[#D4AF37]/35 transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0 flex items-center justify-center">
                            {m.image ? (
                              <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[#B8860B] font-bold text-sm">{m.name.substring(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-gray-900">{m.name}</h5>
                            <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-wider block mt-0.5">
                              {m.roleType === 'founder' 
                                ? 'Founder / Co-Founder' 
                                : m.roleType === 'admin' 
                                ? 'Thư ký / Admin' 
                                : m.roleType === 'leader' 
                                ? `Trưởng Ban ${m.department ? `(${m.department})` : ''}`
                                : `Thành viên ${m.parentLeaderId ? `(Thuộc: ${orgMembers.find(l => l.id === m.parentLeaderId)?.name || 'Trưởng ban'})` : '(Thành viên chung)'}`}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">{m.company}</span>
                            <p className="text-[11px] text-gray-500 font-semibold line-clamp-2">{m.role}</p>
                          </div>
                        </div>

                        <div className="flex space-x-1">
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

            {/* CMS Sub-tab 2: Vinh danh thành viên */}
            {contentSubTab === 'honored' && (
              <div className="space-y-6">
                <div className="bg-[#FDFBF7] border border-[#D4AF37]/20 p-8 rounded-3xl text-center flex flex-col items-center max-w-2xl mx-auto shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#D4AF37]/35 flex items-center justify-center text-[#B8860B] mb-4 shadow-sm">
                    <Plus size={20} />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Tải lên hình ảnh vinh danh mới</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 mb-6">Bạn có thể tải lên một hoặc nhiều hình ảnh cùng lúc</p>

                  <label className="flex items-center space-x-2 px-6 py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer">
                    <Upload size={14} className="stroke-[2.5]" />
                    <span>Bấm để chọn nhiều hình ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultiFileChange}
                    />
                  </label>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-3">Hỗ trợ JPG, PNG, GIF</p>
                </div>

                {/* List Grid of current honored certificate images */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">Các hình ảnh vinh danh hiện tại ({honoredMembers.length})</h4>
                  {honoredMembers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-semibold italic text-xs">
                      Chưa có hình ảnh vinh danh nào được cập nhật.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {honoredMembers.map((m) => (
                        <div 
                          key={m.id} 
                          className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] flex items-center justify-center p-1.5 group"
                        >
                          <img src={m.image} alt="Vinh danh" className="max-w-full max-h-full object-contain rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleDeleteHonoredMember(m.id)}
                            className="absolute -top-1.5 -right-1.5 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-md z-10"
                            title="Xóa hình ảnh này"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CMS Sub-tab: Bài viết & Hoạt động */}
            {contentSubTab === 'activity' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to create activity */}
                <div className="lg:col-span-1 bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/15 shadow-sm">
                  <h4 className="text-xs font-black text-gray-900 mb-4 uppercase tracking-wider flex items-center space-x-2">
                    <PlusCircle className="text-[#D4AF37]" size={16} />
                    <span>Tạo bài viết / Hoạt động mới</span>
                  </h4>

                  {isAdminPostSuccess ? (
                    <div className="p-4 rounded-xl bg-white border border-[#D4AF37]/30 text-[#B8860B] text-center flex items-center justify-center space-x-2 font-bold text-xs">
                      <CheckCircle size={14} />
                      <span>Đã đăng tải thành công!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleAdminPostActivity} className="space-y-4">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Tiêu đề bài viết *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Workshop: Định hình năng lực..."
                          value={newActivity.title}
                          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-gray-250 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Chuyên mục *</label>
                        <select
                          value={newActivity.category}
                          onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as 'Workshop' | 'Networking' | 'Seminar' | 'Sự kiện' })}
                          className="px-3 py-2 rounded-xl border border-gray-250 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        >
                          <option value="Workshop">Workshop</option>
                          <option value="Networking">Networking</option>
                          <option value="Seminar">Seminar</option>
                          <option value="Sự kiện">Sự kiện</option>
                        </select>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Ngày diễn ra / Đăng bài</label>
                        <input
                          type="text"
                          placeholder="Để trống lấy ngày hôm nay"
                          value={newActivity.date}
                          onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-gray-250 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Số lượng người tham gia dự kiến</label>
                        <input
                          type="number"
                          min="1"
                          value={newActivity.attendees}
                          onChange={(e) => setNewActivity({ ...newActivity, attendees: Number(e.target.value) })}
                          className="px-3 py-2 rounded-xl border border-gray-250 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Hình ảnh (Tối đa 3 hình)</label>
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
                          className="w-full text-xs text-gray-500 bg-white border border-gray-250 py-1.5 px-2 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                        />
                        {newActivity.images.length > 0 && (
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {newActivity.images.map((img, idx) => (
                              <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
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

                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Nội dung chi tiết bài viết *</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Nhập nội dung chia sẻ chi tiết..."
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                          className="px-3 py-2 rounded-xl border border-gray-255 focus:border-[#D4AF37] focus:outline-none text-xs font-semibold bg-white resize-none"
                        />
                      </div>

                      <div className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          id="showOnHomepage"
                          checked={newActivity.showOnHomepage}
                          onChange={(e) => setNewActivity({ ...newActivity, showOnHomepage: e.target.checked })}
                          className="w-4 h-4 rounded text-[#D4AF37] border-gray-300 focus:ring-[#D4AF37] cursor-pointer"
                        />
                        <label htmlFor="showOnHomepage" className="text-[10px] font-bold text-gray-700 cursor-pointer select-none">
                          Hiển thị nổi bật trên Trang Chủ
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md hover:shadow-lg transition-all"
                      >
                        Đăng tải hoạt động
                      </button>
                    </form>
                  )}
                </div>

                {/* List of current activities */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">Các hoạt động hiện tại ({activities.length})</h4>
                    {activities.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 font-semibold italic text-xs">
                        Chưa có hoạt động nào được đăng tải.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-500 tracking-wider">
                              <th className="p-3">Hoạt động & Chuyên mục</th>
                              <th className="p-3">Ngày đăng & Quy mô</th>
                              <th className="p-3 text-center">Nổi bật</th>
                              <th className="p-3 text-center">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs font-semibold text-gray-700 divide-y divide-gray-50">
                            {activities.map((act) => (
                              <tr key={act.id} className="hover:bg-gray-50/40 transition-colors">
                                <td className="p-3">
                                  <span className="font-black text-gray-900 block line-clamp-1">{act.title}</span>
                                  <span className="inline-block bg-[#D4AF37]/10 text-[#B8860B] text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1">
                                    {act.category}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className="block text-gray-800">{act.date}</span>
                                  <span className="text-[10px] text-gray-400 block mt-0.5">{act.attendees} người dự kiến</span>
                                </td>
                                <td className="p-3 text-center">
                                  {act.showOnHomepage ? (
                                    <span className="inline-block bg-green-50 text-green-700 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                      Có
                                    </span>
                                  ) : (
                                    <span className="inline-block bg-gray-100 text-gray-400 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                                      Không
                                    </span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteActivity(act.id)}
                                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                                      title="Xóa bài viết này"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CMS Sub-tab 3: Cấu hình Trang chủ */}
            {contentSubTab === 'homepage' && (
              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* Banner Configuration */}
                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/15 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-[#B8860B] uppercase tracking-wider border-b border-[#D4AF37]/10 pb-2">Hình ảnh Banner Trang chủ</h4>
                  <div className="flex flex-col space-y-3">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Ảnh Banner hiện tại</label>
                    <div className="w-full max-w-xl h-44 rounded-2xl border border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 relative">
                      {settingsForm.homepageBannerImage ? (
                        <img src={settingsForm.homepageBannerImage} alt="Home banner" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs italic">Sử dụng Banner mặc định (viền nét đứt)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <label className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl cursor-pointer text-gray-700 transition-colors">
                        <Upload size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Tải ảnh banner mới</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, homepageBannerImage: base64 }))}
                        />
                      </label>
                      {settingsForm.homepageBannerImage && (
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, homepageBannerImage: '' })}
                          className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                        >
                          Xóa banner tùy biến
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Founders Quotes Configuration */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  <h4 className="text-xs font-black text-[#B8860B] uppercase tracking-wider border-b border-gray-150 pb-2">Lời chia sẻ của 3 Nhà sáng lập</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Founder 1 */}
                    <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <h5 className="text-[11px] font-black text-[#B8860B] uppercase tracking-wider">Founder 1 (Hằng Nghĩa Thuận)</h5>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Họ tên</label>
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          value={settingsForm.founder1_name ?? 'Hàng Nghĩa Thuận'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder1_name: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Chức vụ</label>
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          value={settingsForm.founder1_role ?? 'Co-Founder & CEO - Job Service'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder1_role: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Hình ảnh</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {settingsForm.founder1_image ? (
                            <img src={settingsForm.founder1_image} className="w-10 h-10 rounded-full object-cover" alt="F1" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">Ảnh</div>
                          )}
                          <label className="flex items-center space-x-1 px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700 transition-colors text-[9px] font-bold uppercase">
                            <Upload size={10} />
                            <span>Đổi ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, founder1_image: base64 }))}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Lời phát biểu</label>
                        <textarea
                          rows={4}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-semibold leading-relaxed"
                          value={settingsForm.founder1_quote ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder1_quote: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Founder 2 */}
                    <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <h5 className="text-[11px] font-black text-[#B8860B] uppercase tracking-wider">Founder 2 (Nguyễn Văn A)</h5>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Họ tên</label>
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          value={settingsForm.founder2_name ?? 'Nguyễn Văn A'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder2_name: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Chức vụ</label>
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          value={settingsForm.founder2_role ?? 'Co-Founder'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder2_role: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Hình ảnh</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {settingsForm.founder2_image ? (
                            <img src={settingsForm.founder2_image} className="w-10 h-10 rounded-full object-cover" alt="F2" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">Ảnh</div>
                          )}
                          <label className="flex items-center space-x-1 px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700 transition-colors text-[9px] font-bold uppercase">
                            <Upload size={10} />
                            <span>Đổi ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, founder2_image: base64 }))}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Lời phát biểu</label>
                        <textarea
                          rows={4}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-semibold leading-relaxed"
                          value={settingsForm.founder2_quote ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder2_quote: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Founder 3 */}
                    <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                      <h5 className="text-[11px] font-black text-[#B8860B] uppercase tracking-wider">Founder 3 (Trần Văn B)</h5>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Họ tên</label>
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          value={settingsForm.founder3_name ?? 'Trần Văn B'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder3_name: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Chức vụ</label>
                        <input
                          type="text"
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          value={settingsForm.founder3_role ?? 'Co-Founder'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder3_role: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Hình ảnh</label>
                        <div className="flex items-center space-x-2 mt-1">
                          {settingsForm.founder3_image ? (
                            <img src={settingsForm.founder3_image} className="w-10 h-10 rounded-full object-cover" alt="F3" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">Ảnh</div>
                          )}
                          <label className="flex items-center space-x-1 px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700 transition-colors text-[9px] font-bold uppercase">
                            <Upload size={10} />
                            <span>Đổi ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, (base64) => setSettingsForm({ ...settingsForm, founder3_image: base64 }))}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-600">Lời phát biểu</label>
                        <textarea
                          rows={4}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-semibold leading-relaxed"
                          value={settingsForm.founder3_quote ?? ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, founder3_quote: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md hover:shadow-lg transition-all"
                  >
                    Lưu toàn bộ cấu hình trang chủ
                  </button>
                </div>
              </form>
            )}

            {/* CMS Sub-tab 4: Cấu hình CEO Hằng Nghĩa Thuận */}
            {contentSubTab === 'thuanhn' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/15 shadow-sm space-y-6">
                  <h4 className="text-xs font-black text-[#B8860B] uppercase tracking-wider border-b border-[#D4AF37]/10 pb-2">
                    Cấu hình trang giới thiệu anh Hằng Nghĩa Thuận (`/ve-thuan-hn`)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                      {/* Avatar upload */}
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Hình ảnh chân dung</label>
                        <div className="w-full h-64 border border-gray-200 bg-white rounded-2xl overflow-hidden flex items-center justify-center relative">
                          {settingsForm.thuanHn_image ? (
                            <img src={settingsForm.thuanHn_image} alt="CEO portrait" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs italic">Chưa tải ảnh chân dung lên</span>
                          )}
                        </div>
                        <label className="flex items-center justify-center space-x-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl cursor-pointer text-gray-700 transition-colors text-xs font-bold uppercase mt-2">
                          <Upload size={14} />
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

                    <div className="md:col-span-2 space-y-4">
                      {/* Name and role */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Họ và tên CEO *</label>
                          <input
                            type="text"
                            required
                            className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold"
                            value={settingsForm.founder1_name ?? 'Hàng Nghĩa Thuận'}
                            onChange={(e) => setSettingsForm({ ...settingsForm, founder1_name: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Chức danh / Chức vụ *</label>
                          <input
                            type="text"
                            required
                            className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold"
                            value={settingsForm.thuanHn_role ?? 'Co-Founder & CEO - Job Service'}
                            onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_role: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Contacts */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Điện thoại</label>
                          <input
                            type="text"
                            className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold"
                            value={settingsForm.thuanHn_phone ?? '+84 98 61 62 568'}
                            onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_phone: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Email</label>
                          <input
                            type="text"
                            className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold"
                            value={settingsForm.thuanHn_email ?? 'ttg.thuanhn@gmail.com'}
                            onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_email: e.target.value })}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Địa chỉ văn phòng</label>
                          <input
                            type="text"
                            className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold"
                            value={settingsForm.thuanHn_address ?? 'KDC Lê Thành, An Lạc, TP.HCM'}
                            onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_address: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Biography section */}
                      <div className="flex flex-col space-y-3">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Đoạn giới thiệu tiểu sử (Bio)</label>
                        
                        <div className="space-y-3">
                          <div className="flex flex-col space-y-1">
                            <span className="text-[9px] font-bold text-gray-400">Đoạn 1 (Thành tựu chung)</span>
                            <textarea
                              rows={3}
                              className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold leading-relaxed"
                              value={settingsForm.thuanHn_about1 ?? ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_about1: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-[9px] font-bold text-gray-400">Đoạn 2 (Thế mạnh chuyên môn)</span>
                            <textarea
                              rows={3}
                              className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold leading-relaxed"
                              value={settingsForm.thuanHn_about2 ?? ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_about2: e.target.value })}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-[9px] font-bold text-gray-400">Đoạn 3 (Sứ mệnh & Triết lý)</span>
                            <textarea
                              rows={3}
                              className="px-4 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold leading-relaxed"
                              value={settingsForm.thuanHn_about3 ?? ''}
                              onChange={(e) => setSettingsForm({ ...settingsForm, thuanHn_about3: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full text-white font-bold text-xs uppercase tracking-wider gradient-gold-bg shadow-md hover:shadow-lg transition-all"
                  >
                    Lưu cấu hình CEO Hằng Nghĩa Thuận
                  </button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
