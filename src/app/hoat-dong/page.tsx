'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Send,
  Heart,
  MessageSquare,
  Calendar,
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



  useEffect(() => {
    setCurrentUser(dbHelper.getCurrentUser());
    async function loadActivities() {
      // 1. Load from local cache immediately (instant render)
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('sntn_activities');
        if (local) {
          try {
            const cachedData = JSON.parse(local);
            setActivitiesList(cachedData);
            
            // Check autoSelect from cache first
            const autoSelectId = sessionStorage.getItem('sntn_goto_activity_id');
            if (autoSelectId) {
              const matched = cachedData.find((a: any) => a.id === autoSelectId);
              if (matched) {
                setSelectedActivityDetail(matched);
              }
            }
          } catch (e) {
            console.error("Error parsing local activities:", e);
          }
        }
      }

      // 2. Fetch fresh data from Supabase in the background
      try {
        const data = await dbHelper.getActivities();
        setActivitiesList(data);

        if (typeof window !== 'undefined') {
          const autoSelectId = sessionStorage.getItem('sntn_goto_activity_id');
          if (autoSelectId) {
            const matched = data.find(a => a.id === autoSelectId);
            if (matched) {
              setSelectedActivityDetail(matched);
            }
            sessionStorage.removeItem('sntn_goto_activity_id');
          }
        }
      } catch (err) {
        console.error("Error loading activities:", err);
      }
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



  const filteredActivities = activitiesList.filter(act => {
    if (selectedCategory === 'Tất cả') return true;
    return act.category === selectedCategory;
  });

  if (selectedActivityDetail) {
    return (
      <div className="bg-white min-h-screen pb-20 pt-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedActivityDetail(null)}
            className="flex items-center space-x-2 text-xs text-gray-500 hover:text-[#D4AF37] font-bold mb-8 transition-colors uppercase tracking-wider"
          >
            <span>← Quay lại danh sách</span>
          </button>

          <div className="space-y-8">
            {/* Image Banner */}
            <div className="w-full h-64 md:h-[450px] rounded-3xl bg-gray-50 border border-[#D4AF37]/15 overflow-hidden flex items-center justify-center text-6xl shadow-inner relative">
              {selectedActivityDetail.images && selectedActivityDetail.images.length > 0 ? (
                <ActivityImagesCarousel images={selectedActivityDetail.images} />
              ) : (
                emojiMap[selectedActivityDetail.imageType || 'books']
              )}
            </div>

            {/* Content Wrapper */}
            <div className="space-y-6">
              {/* Tag & Meta Info */}
              <div className="space-y-3">
                <span className="inline-block text-xs font-black text-[#B8860B] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                  {selectedActivityDetail.category}
                </span>

                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">
                  {selectedActivityDetail.title}
                </h1>

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
                <div className="text-sm md:text-base text-gray-700 leading-relaxed font-semibold whitespace-pre-line bg-[#FDFBF7]/60 p-6 md:p-8 rounded-3xl border border-[#D4AF37]/10 shadow-sm">
                  {selectedActivityDetail.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    </div>
  );
}
