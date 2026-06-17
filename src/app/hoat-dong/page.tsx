'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Send,
  Heart,
  MessageSquare,
  Calendar,
  PlusCircle,
  X
} from 'lucide-react';
import { dbHelper, UserSession, CommunityActivity } from '@/lib/supabase';
import { MotionDiv } from '@/components/motion';

const ActivityImagesCarousel = ({ images }: { images: string[] }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-full group">
      <img 
        src={images[currentIdx]} 
        alt="Activity" 
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <X size={10} className="rotate-45" /> {/* Simple left chevron substitute or rotate close */}
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          >
            <X size={10} className="-rotate-45" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
            {images.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'bg-[#D4AF37] scale-125' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const emojiMap: Record<string, string> = {
  books: '📚',
  networking: '🤝',
  award: '🏆',
  seminar: '🎤',
  celebration: '🎉'
};

const categories = ['Tất cả', 'Workshop', 'Networking', 'Seminar', 'Sự kiện'];

export default function HoatDong() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activitiesList, setActivitiesList] = useState<CommunityActivity[]>([]);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<CommunityActivity | null>(null);
  
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Admin states
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

  useEffect(() => {
    setCurrentUser(dbHelper.getCurrentUser());
    async function loadActivities() {
      const data = await dbHelper.getActivities();
      setActivitiesList(data);
    }
    loadActivities();

    const handleLoginChange = () => {
      setCurrentUser(dbHelper.getCurrentUser());
    };
    window.addEventListener('sntn_login_change', handleLoginChange);
    return () => {
      window.removeEventListener('sntn_login_change', handleLoginChange);
    };
  }, []);

  const handleLike = async (actId: string) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thích bài viết này.');
      return;
    }
    const updatedLikes = await dbHelper.toggleLikeActivity(actId, currentUser.email);
    setActivitiesList(prev => prev.map(a => a.id === actId ? { ...a, likes: updatedLikes } : a));
  };

  const handleCommentSubmit = async (actId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Vui lòng đăng nhập để bình luận.');
      return;
    }
    const text = commentInputs[actId] || '';
    if (!text.trim()) return;

    const newComment = await dbHelper.addCommentToActivity(actId, {
      userEmail: currentUser.email,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      content: text.trim()
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

    setCommentInputs(prev => ({ ...prev, [actId]: '' }));
  };

  const toggleComments = (actId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [actId]: !prev[actId]
    }));
  };

  const handleAdminPostActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') return;

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
    setActivitiesList([added, ...activitiesList]);
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

  const filteredActivities = activitiesList.filter(act => {
    if (selectedCategory === 'Tất cả') return true;
    return act.category === selectedCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-[#FDFBF7] to-white border-b border-[#D4AF37]/5 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
            Kết nối tri thức & Hoạt động
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mt-6 mb-6">
            Hoạt động trên <span className="gradient-gold-text">Cộng đồng</span>
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto mb-6" />
          <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Học hỏi chuyên môn, kết nối nghề nghiệp và chia sẻ các hoạt động cùng mạng lưới quản lý nhân lực hàng đầu tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Main activities block */}
      <section className="py-12 bg-white max-w-7xl mx-auto px-6">
        {/* Admin Create Activity Panel */}
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

                <div className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id="showOnHomepage"
                    checked={newActivity.showOnHomepage}
                    onChange={(e) => setNewActivity({ ...newActivity, showOnHomepage: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D4AF37] border-gray-300 focus:ring-[#D4AF37] cursor-pointer"
                  />
                  <label htmlFor="showOnHomepage" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                    Hiển thị bài viết này ở mục Hoạt động nổi bật trên Trang Chủ
                  </label>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-extrabold text-[#B8860B] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                        {act.category}
                      </span>
                      {act.showOnHomepage && (
                        <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-md">
                          Trang chủ
                        </span>
                      )}
                    </div>

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
                            <p className="text-[10px] text-gray-400 italic font-bold">Chưa có bình luận nào.</p>
                          )}
                        </div>

                        {/* Add comment form */}
                        {currentUser && (
                          <form onSubmit={(e) => handleCommentSubmit(act.id, e)} className="flex items-center space-x-2 pt-2 border-t border-gray-50">
                            <input
                              type="text"
                              placeholder="Viết bình luận..."
                              value={commentInputs[act.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [act.id]: e.target.value }))}
                              className="flex-grow px-3 py-1.5 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:outline-none text-[11px] font-semibold bg-white"
                            />
                            <button
                              type="submit"
                              className="p-1.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#B8860B] transition-colors"
                            >
                              <Send size={12} />
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        )}
      </section>

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
