// Supabase configuration - anon key is safe to be public (RLS policies control access)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrnlddkadciefchdizct.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybmxkZGthZGNpZWZjaGRpemN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzA5NTMsImV4cCI6MjA5NzU0Njk1M30.t5ndpiD9tKwSLjB2Pgh01RJ5gP7Cnkg65QnRZJ8Kxb8';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Clean up mock data and reseed if version mismatch
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('sntn_cleared_mock_data_v10')) {
    localStorage.removeItem('sntn_jobs');
    localStorage.removeItem('sntn_activities');
    localStorage.removeItem('sntn_org_members');
    localStorage.removeItem('sntn_honored_members');
    localStorage.removeItem('sntn_system_settings');
    localStorage.removeItem('sntn_members');
    localStorage.setItem('sntn_cleared_mock_data_v10', 'true');
  }
}

// Mock database structures and APIs
export interface UserSession {
  email: string;
  fullName: string;
  role: 'admin' | 'partner';
  company?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  skills: string[];
  level: string;
  type: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  workingTime?: string;
  workingAddress?: string;
  isHeadhunt?: boolean;
  referralCommission?: string;
  created_at: string;
  posted_by?: string; // User email who posted
  approved: boolean; // Approved by admin
}

export interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  linkedin: string;
  experience: number;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  cvLink: string;
  created_at: string;
  referrerName?: string;
  referrerEmail?: string;
  referrerPhone?: string;
  isReferral?: boolean;
}

export interface ActivityComment {
  id: string;
  userEmail: string;
  userName: string;
  userRole: 'admin' | 'partner' | 'guest';
  content: string;
  created_at: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  category: 'Workshop' | 'Networking' | 'Seminar' | 'Sự kiện';
  description: string;
  date: string;
  attendees: number;
  likes: string[]; // List of user emails who liked
  comments: ActivityComment[];
  imageType?: 'books' | 'handshake' | 'briefcase' | 'target' | 'party' | 'coffee';
  images?: string[]; // Array of up to 3 image base64 strings
  showOnHomepage?: boolean;
  created_at: string;
}

export interface OrgMember {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string; // Base64 or URL
  roleType: 'founder' | 'admin' | 'leader' | 'member';
  department?: string;
  parentLeaderId?: string;
  created_at: string;
}

export interface HonoredMember {
  id: string;
  name?: string;
  company?: string;
  title?: string;
  image: string; // Base64 or URL
  reason?: string;
  created_at: string;
}

export interface SystemSettings {
  homepageBannerImage?: string;
  
  founder1_name?: string;
  founder1_role?: string;
  founder1_image?: string;
  founder1_quote?: string;
  
  founder2_name?: string;
  founder2_role?: string;
  founder2_image?: string;
  founder2_quote?: string;
  
  founder3_name?: string;
  founder3_role?: string;
  founder3_image?: string;
  founder3_quote?: string;
  
  thuanHn_about1?: string;
  thuanHn_about2?: string;
  thuanHn_about3?: string;
  thuanHn_role?: string;
  thuanHn_image?: string;
  thuanHn_phone?: string;
  thuanHn_email?: string;
  thuanHn_address?: string;
}

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Trưởng Phòng Đối Tác Nhân Sự (HRBP)',
    company: 'CÔNG TY TNHH XUẤT NHẬP KHẨU PHÁT TRIỂN ĐÔNG DƯƠNG',
    salary: 'Thỏa thuận',
    location: 'TP. Hồ Chí Minh',
    skills: ['HRBP', 'Headhunt', 'Tuyển dụng', 'Senior'],
    level: 'Senior',
    type: 'Full-time',
    description: `1. Quản lý toàn bộ hoạt động tuyển dụng nhân sự.\n2. Xây dựng kế hoạch và ngân sách nhân sự.\n3. Hỗ trợ các phòng ban về mặt nhân sự và đào tạo.`,
    requirements: `- Trên 5 năm kinh nghiệm làm HRBP hoặc vị trí tương đương.\n- Tốt nghiệp Đại học chuyên ngành quản trị nhân lực hoặc liên quan.\n- Kỹ năng giao tiếp và giải quyết vấn đề tốt.`,
    benefits: `- Lương tháng 13 + thưởng KPIs hấp dẫn.\n- Đóng BHXH đầy đủ theo Luật lao động.\n- Môi trường làm việc chuyên nghiệp, cơ hội thăng tiến cao.`,
    workingTime: 'Thứ 2 - Thứ 6 (8:00 - 17:30)',
    workingAddress: 'Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh',
    isHeadhunt: true,
    referralCommission: '20.000.000đ',
    created_at: '2026-06-18T00:00:00.000Z',
    posted_by: 'admin@sntn.vn',
    approved: true
  },
  {
    id: 'job-2',
    title: 'Chuyên Viên Tuyển Dụng Cấp Cao (Senior Recruiter)',
    company: 'JOB SERVICE',
    salary: '15,000,000 - 25,000,000 VND',
    location: 'TP. Hồ Chí Minh',
    skills: ['Recruitment', 'Sourcing', 'Interviewing'],
    level: 'Senior',
    type: 'Full-time',
    description: `- Thực hiện tìm kiếm và phỏng vấn ứng viên các vị trí cấp trung và cấp cao.\n- Xây dựng và mở rộng mạng lưới nguồn ứng viên tiềm năng.\n- Chăm sóc khách hàng doanh nghiệp đối tác.`,
    requirements: `- Có từ 3 năm kinh nghiệm trong lĩnh vực Headhunt hoặc Tuyển dụng nội bộ.\n- Kỹ năng phỏng vấn, đánh giá ứng viên xuất sắc.\n- Chủ động, chịu được áp lực công việc tốt.`,
    benefits: `- Lương cứng cạnh tranh + Hoa hồng tuyển dụng cực cao.\n- Được đào tạo kỹ năng nâng cao trực tiếp từ CEO Hàng Nghĩa Thuận.\n- Tham gia các hoạt động teambuilding, du lịch hàng năm.`,
    workingTime: 'Thứ 2 - Thứ 6 (8:30 - 18:00)',
    workingAddress: 'KDC Lê Thành, An Lạc, Bình Tân, TP. Hồ Chí Minh',
    isHeadhunt: false,
    referralCommission: '',
    created_at: '2026-06-18T00:00:00.000Z',
    posted_by: 'admin@sntn.vn',
    approved: true
  }
];

const DEFAULT_ACTIVITIES: CommunityActivity[] = [];

// Helper to execute query against Supabase with local storage fallback
async function executeDbQuery<T>(
  supabaseOp: () => PromiseLike<{ data: any; error: any }>,
  localStorageOp: () => T | Promise<T>,
  onSuccess?: (data: any) => void
): Promise<T> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabaseOp();
      if (!error && data !== null) {
        if (onSuccess) {
          onSuccess(data);
        }
        return data as T;
      }
      if (error) {
        console.warn('Supabase query error, falling back to localStorage:', error);
      }
    } catch (e) {
      console.warn('Supabase query exception, falling back to localStorage:', e);
    }
  }
  return await localStorageOp();
}

// Helper to execute mutation against Supabase with local storage fallback
async function executeDbMutation(
  supabaseOp: () => PromiseLike<{ error: any }>,
  localStorageOp: () => void | Promise<void>
): Promise<boolean> {
  let success = false;
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabaseOp();
      if (!error) {
        success = true;
      } else {
        console.warn('Supabase mutation error, applying to localStorage only:', error);
      }
    } catch (e) {
      console.warn('Supabase mutation exception, applying to localStorage only:', e);
    }
  }
  await localStorageOp();
  return success;
}

export const dbHelper = {
  // --- AUTH LAYER ---
  getCurrentUser(): UserSession | null {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem('sntn_session');
    return session ? JSON.parse(session) : null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(email: string, _password?: string): Promise<UserSession | null> {
    if (typeof window === 'undefined') return null;
    
    // Normalizing email
    const trimmedEmail = email.trim().toLowerCase();
    let sessionUser: UserSession | null = null;

    if (trimmedEmail === 'admin@sntn.vn') {
      sessionUser = {
        email: 'admin@sntn.vn',
        fullName: 'Hàng Nghĩa Thuận',
        role: 'admin',
        company: 'Săn Tài Năng'
      };
    } else if (trimmedEmail === 'partner@sntn.vn' || trimmedEmail.includes('partner')) {
      sessionUser = {
        email: trimmedEmail,
        fullName: 'Nguyễn Minh Partner',
        role: 'partner',
        company: 'TechVina Group'
      };
    } else {
      // Default to guest/normal partner for testing
      sessionUser = {
        email: trimmedEmail,
        fullName: 'Thành viên Cộng đồng',
        role: 'partner',
        company: 'Đại diện Doanh nghiệp'
      };
    }

    localStorage.setItem('sntn_session', JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sntn_session');
  },

  // --- JOBS API ---
  async getJobs(): Promise<Job[]> {
    return executeDbQuery<Job[]>(
      () => supabase!.from('sntn_jobs').select('*').order('created_at', { ascending: false }),
      async () => {
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('sntn_jobs');
          if (local) {
            return JSON.parse(local);
          } else {
            localStorage.setItem('sntn_jobs', JSON.stringify(DEFAULT_JOBS));
            return DEFAULT_JOBS;
          }
        }
        return DEFAULT_JOBS;
      },
      (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sntn_jobs', JSON.stringify(data));
        }
      }
    );
  },

  async addJob(job: Omit<Job, 'id' | 'created_at' | 'approved' | 'posted_by'>, postedByEmail?: string, approveImmediately = false): Promise<Job> {
    const newJob: Job = {
      ...job,
      id: 'job-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      posted_by: postedByEmail || 'guest',
      approved: approveImmediately
    };

    await executeDbMutation(
      () => supabase!.from('sntn_jobs').insert(newJob),
      async () => {
        if (typeof window !== 'undefined') {
          const currentJobs = await dbHelper.getJobs();
          const updatedJobs = [newJob, ...currentJobs];
          localStorage.setItem('sntn_jobs', JSON.stringify(updatedJobs));
        }
      }
    );
    return newJob;
  },

  async approveJob(jobId: string): Promise<boolean> {
    let found = false;
    await executeDbMutation(
      () => supabase!.from('sntn_jobs').update({ approved: true }).eq('id', jobId),
      async () => {
        if (typeof window !== 'undefined') {
          const currentJobs = await dbHelper.getJobs();
          const idx = currentJobs.findIndex(j => j.id === jobId);
          if (idx !== -1) {
            currentJobs[idx].approved = true;
            localStorage.setItem('sntn_jobs', JSON.stringify(currentJobs));
            found = true;
          }
        }
      }
    );
    return isSupabaseConfigured ? true : found;
  },

  async editJob(jobId: string, updatedData: Partial<Omit<Job, 'id' | 'created_at' | 'posted_by'>>): Promise<boolean> {
    let found = false;
    await executeDbMutation(
      () => supabase!.from('sntn_jobs').update(updatedData).eq('id', jobId),
      async () => {
        if (typeof window !== 'undefined') {
          const currentJobs = await dbHelper.getJobs();
          const idx = currentJobs.findIndex(j => j.id === jobId);
          if (idx !== -1) {
            currentJobs[idx] = {
              ...currentJobs[idx],
              ...updatedData
            };
            localStorage.setItem('sntn_jobs', JSON.stringify(currentJobs));
            found = true;
          }
        }
      }
    );
    return isSupabaseConfigured ? true : found;
  },

  async deleteJob(jobId: string): Promise<boolean> {
    await executeDbMutation(
      () => supabase!.from('sntn_jobs').delete().eq('id', jobId),
      async () => {
        if (typeof window !== 'undefined') {
          const currentJobs = await dbHelper.getJobs();
          const updated = currentJobs.filter(j => j.id !== jobId);
          localStorage.setItem('sntn_jobs', JSON.stringify(updated));
        }
      }
    );
    return true;
  },

  // --- JOB APPLICATIONS (CVs) API ---
  async getApplications(): Promise<JobApplication[]> {
    return executeDbQuery<JobApplication[]>(
      () => supabase!.from('sntn_applications').select('*').order('created_at', { ascending: false }),
      async () => {
        if (typeof window === 'undefined') return [];
        const local = localStorage.getItem('sntn_applications');
        return local ? JSON.parse(local) : [];
      },
      (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sntn_applications', JSON.stringify(data));
        }
      }
    );
  },

  async addApplication(app: Omit<JobApplication, 'id' | 'created_at'>): Promise<JobApplication> {
    const newApp: JobApplication = {
      ...app,
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    await executeDbMutation(
      () => supabase!.from('sntn_applications').insert(newApp),
      async () => {
        if (typeof window !== 'undefined') {
          const apps = await dbHelper.getApplications();
          const updated = [newApp, ...apps];
          localStorage.setItem('sntn_applications', JSON.stringify(updated));
        }
      }
    );
    return newApp;
  },

  // --- MEMBERS API (COMMUNITY REGISTRATION) ---
  async getMembers(): Promise<Member[]> {
    return executeDbQuery<Member[]>(
      () => supabase!.from('sntn_members').select('*').order('created_at', { ascending: false }),
      async () => {
        if (typeof window === 'undefined') return [];
        const local = localStorage.getItem('sntn_members');
        if (local) {
          return JSON.parse(local);
        } else {
          const defaults: Member[] = [
            {
              id: 'member-mock-1',
              fullName: 'Nguyễn Văn An',
              email: 'an.nguyen@fpt.com',
              phone: '0912345678',
              company: 'FPT Software',
              title: 'Chuyên viên Tuyển dụng (TA Specialist)',
              linkedin: 'https://linkedin.com/in/annguyen',
              experience: 3,
              status: 'pending',
              created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
            },
            {
              id: 'member-mock-2',
              fullName: 'Trần Thị Bình',
              email: 'binh.tran@vingroup.com',
              phone: '0987654321',
              company: 'Vingroup',
              title: 'Trưởng Phòng Nhân Sự (HR Manager)',
              linkedin: 'https://linkedin.com/in/binhtran',
              experience: 8,
              status: 'pending',
              created_at: new Date().toISOString() // just now
            },
            {
              id: 'member-mock-3',
              fullName: 'Lê Văn Cường',
              email: 'cuong.le@tiki.vn',
              phone: '0901234567',
              company: 'Tiki',
              title: 'Chuyên viên Tuyển dụng Cấp cao',
              linkedin: 'https://linkedin.com/in/cuongle',
              experience: 2,
              status: 'approved',
              created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString() // 5 days ago
            }
          ];
          localStorage.setItem('sntn_members', JSON.stringify(defaults));
          return defaults;
        }
      },
      (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sntn_members', JSON.stringify(data));
        }
      }
    );
  },

  async registerMember(member: Omit<Member, 'id' | 'created_at' | 'status'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      status: 'pending',
      id: 'member-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    await executeDbMutation(
      () => supabase!.from('sntn_members').insert(newMember),
      async () => {
        if (typeof window !== 'undefined') {
          const members = await dbHelper.getMembers();
          members.push(newMember);
          localStorage.setItem('sntn_members', JSON.stringify(members));
        }
      }
    );
    return newMember;
  },

  async approveMember(memberId: string): Promise<boolean> {
    let found = false;
    await executeDbMutation(
      () => supabase!.from('sntn_members').update({ status: 'approved' }).eq('id', memberId),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getMembers();
        const idx = members.findIndex(m => m.id === memberId);
        if (idx !== -1) {
          members[idx].status = 'approved';
          localStorage.setItem('sntn_members', JSON.stringify(members));
          found = true;
        }
      }
    );
    return isSupabaseConfigured ? true : found;
  },

  async rejectMember(memberId: string): Promise<boolean> {
    let found = false;
    await executeDbMutation(
      () => supabase!.from('sntn_members').update({ status: 'rejected' }).eq('id', memberId),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getMembers();
        const idx = members.findIndex(m => m.id === memberId);
        if (idx !== -1) {
          members[idx].status = 'rejected';
          localStorage.setItem('sntn_members', JSON.stringify(members));
          found = true;
        }
      }
    );
    return isSupabaseConfigured ? true : found;
  },

  async saveMember(member: Member): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_members').upsert(member),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getMembers();
        const idx = members.findIndex(m => m.id === member.id);
        if (idx !== -1) {
          members[idx] = member;
        } else {
          members.push(member);
        }
        localStorage.setItem('sntn_members', JSON.stringify(members));
      }
    );
  },

  async deleteMember(id: string): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_members').delete().eq('id', id),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getMembers();
        const filtered = members.filter(m => m.id !== id);
        localStorage.setItem('sntn_members', JSON.stringify(filtered));
      }
    );
  },

  // --- CONTACT MESSAGES API ---
  async sendContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    await executeDbMutation(
      () => supabase!.from('sntn_messages').insert(newMsg),
      async () => {
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('sntn_messages');
          const messages = local ? JSON.parse(local) : [];
          messages.push(newMsg);
          localStorage.setItem('sntn_messages', JSON.stringify(messages));
        }
      }
    );
    return newMsg;
  },

  // --- COMMUNITY ACTIVITIES API ---
  async getActivities(): Promise<CommunityActivity[]> {
    return executeDbQuery<CommunityActivity[]>(
      () => supabase!.from('sntn_activities').select('*').order('created_at', { ascending: false }),
      async () => {
        if (typeof window !== 'undefined') {
          const local = localStorage.getItem('sntn_activities');
          if (local) {
            return JSON.parse(local);
          } else {
            localStorage.setItem('sntn_activities', JSON.stringify(DEFAULT_ACTIVITIES));
            return DEFAULT_ACTIVITIES;
          }
        }
        return DEFAULT_ACTIVITIES;
      },
      (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sntn_activities', JSON.stringify(data));
        }
      }
    );
  },

  async addActivity(act: Omit<CommunityActivity, 'id' | 'created_at' | 'likes' | 'comments'>): Promise<CommunityActivity> {
    const newAct: CommunityActivity = {
      ...act,
      id: 'act-' + Math.random().toString(36).substr(2, 9),
      likes: [],
      comments: [],
      created_at: new Date().toISOString()
    };
    await executeDbMutation(
      () => supabase!.from('sntn_activities').insert(newAct),
      async () => {
        if (typeof window !== 'undefined') {
          const activities = await dbHelper.getActivities();
          const updated = [newAct, ...activities];
          localStorage.setItem('sntn_activities', JSON.stringify(updated));
        }
      }
    );
    return newAct;
  },

  async toggleLikeActivity(activityId: string, userEmail: string): Promise<string[]> {
    let resultLikes: string[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('sntn_activities').select('likes').eq('id', activityId).single();
        if (data) {
          const likes = data.likes || [];
          const userIdx = likes.indexOf(userEmail);
          if (userIdx === -1) {
            likes.push(userEmail);
          } else {
            likes.splice(userIdx, 1);
          }
          const { error } = await supabase.from('sntn_activities').update({ likes }).eq('id', activityId);
          if (!error) {
            resultLikes = likes;
          }
        }
      } catch (e) {
        console.warn('Supabase toggleLike error:', e);
      }
    }
    
    if (typeof window !== 'undefined') {
      const activities = await dbHelper.getActivities();
      const idx = activities.findIndex(a => a.id === activityId);
      if (idx !== -1) {
        const likes = activities[idx].likes || [];
        const userIdx = likes.indexOf(userEmail);
        if (userIdx === -1) {
          likes.push(userEmail);
        } else {
          likes.splice(userIdx, 1);
        }
        activities[idx].likes = likes;
        localStorage.setItem('sntn_activities', JSON.stringify(activities));
        if (resultLikes.length === 0) {
          resultLikes = likes;
        }
      }
    }
    return resultLikes;
  },

  async addCommentToActivity(activityId: string, comment: Omit<ActivityComment, 'id' | 'created_at'>): Promise<ActivityComment> {
    const newComment: ActivityComment = {
      ...comment,
      id: 'comment-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('sntn_activities').select('comments').eq('id', activityId).single();
        if (data) {
          const comments = [...(data.comments || []), newComment];
          await supabase.from('sntn_activities').update({ comments }).eq('id', activityId);
        }
      } catch (e) {
        console.warn('Supabase addComment error:', e);
      }
    }
    if (typeof window !== 'undefined') {
      const activities = await dbHelper.getActivities();
      const idx = activities.findIndex(a => a.id === activityId);
      if (idx !== -1) {
        activities[idx].comments = [...(activities[idx].comments || []), newComment];
        localStorage.setItem('sntn_activities', JSON.stringify(activities));
      }
    }
    return newComment;
  },

  async deleteActivity(id: string): Promise<boolean> {
    await executeDbMutation(
      () => supabase!.from('sntn_activities').delete().eq('id', id),
      async () => {
        if (typeof window === 'undefined') return;
        const activities = await dbHelper.getActivities();
        const filtered = activities.filter(a => a.id !== id);
        localStorage.setItem('sntn_activities', JSON.stringify(filtered));
      }
    );
    return true;
  },

  // --- ORG MEMBERS API ---
  async getOrgMembers(): Promise<OrgMember[]> {
    return executeDbQuery<OrgMember[]>(
      () => supabase!.from('sntn_org_members').select('*').order('created_at', { ascending: true }),
      async () => {
        if (typeof window === 'undefined') return [];
        const local = localStorage.getItem('sntn_org_members');
        if (local) {
          return JSON.parse(local);
        } else {
          const defaults: OrgMember[] = [
            {
              id: 'org-1',
              name: 'Anh Hàng Nghĩa Thuận',
              role: 'Sáng lập Cộng đồng Săn Tài Năng & CEO Job Service',
              company: 'Job Service',
              image: '/thuan-hn.jpg',
              roleType: 'founder',
              created_at: new Date().toISOString()
            },
            {
              id: 'org-2',
              name: 'Nguyễn Thị B',
              role: 'TA MANAGER',
              company: 'CÔNG TY XZC',
              image: '/nguyen-thi-c.png',
              roleType: 'admin',
              created_at: new Date().toISOString()
            },
            {
              id: 'org-3',
              name: 'Nguyễn Văn B',
              role: 'LEADER TUYỂN DỤNG',
              company: 'COCACOLA',
              image: '',
              roleType: 'leader',
              department: 'Ban Tuyển dụng',
              created_at: new Date().toISOString()
            },
            {
              id: 'org-4',
              name: 'Nguyễn Văn C',
              role: 'TRƯỞNG NHÓM TUYỂN DỤNG',
              company: 'TIKITIKI',
              image: '',
              roleType: 'member',
              parentLeaderId: 'org-3',
              created_at: new Date().toISOString()
            },
            {
              id: 'org-5',
              name: 'Nguyễn Văn BCX',
              role: 'TA MANAGER',
              company: 'JOB SV',
              image: '',
              roleType: 'member',
              parentLeaderId: 'org-3',
              created_at: new Date().toISOString()
            },
            {
              id: 'org-6',
              name: 'Nguyễn Văn B',
              role: 'LEADER',
              company: 'BAUDSFB',
              image: '',
              roleType: 'member',
              parentLeaderId: 'org-3',
              created_at: new Date().toISOString()
            }
          ];
          localStorage.setItem('sntn_org_members', JSON.stringify(defaults));
          return defaults;
        }
      },
      (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sntn_org_members', JSON.stringify(data));
        }
      }
    );
  },

  async saveOrgMember(member: OrgMember): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_org_members').upsert(member),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getOrgMembers();
        const idx = members.findIndex(m => m.id === member.id);
        if (idx !== -1) {
          members[idx] = member;
        } else {
          members.push(member);
        }
        localStorage.setItem('sntn_org_members', JSON.stringify(members));
      }
    );
  },

  async deleteOrgMember(id: string): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_org_members').delete().eq('id', id),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getOrgMembers();
        const filtered = members.filter(m => m.id !== id);
        localStorage.setItem('sntn_org_members', JSON.stringify(filtered));
      }
    );
  },

  // --- HONORED MEMBERS API ---
  async getHonoredMembers(): Promise<HonoredMember[]> {
    return executeDbQuery<HonoredMember[]>(
      () => supabase!.from('sntn_honored_members').select('*').order('created_at', { ascending: true }),
      async () => {
        if (typeof window === 'undefined') return [];
        const local = localStorage.getItem('sntn_honored_members');
        if (local) {
          return JSON.parse(local);
        } else {
          const defaults: HonoredMember[] = [];
          localStorage.setItem('sntn_honored_members', JSON.stringify(defaults));
          return defaults;
        }
      },
      (data) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('sntn_honored_members', JSON.stringify(data));
        }
      }
    );
  },

  async saveHonoredMember(member: HonoredMember): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_honored_members').upsert(member),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getHonoredMembers();
        const idx = members.findIndex(m => m.id === member.id);
        if (idx !== -1) {
          members[idx] = member;
        } else {
          members.push(member);
        }
        localStorage.setItem('sntn_honored_members', JSON.stringify(members));
      }
    );
  },

  async deleteHonoredMember(id: string): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_honored_members').delete().eq('id', id),
      async () => {
        if (typeof window === 'undefined') return;
        const members = await dbHelper.getHonoredMembers();
        const filtered = members.filter(m => m.id !== id);
        localStorage.setItem('sntn_honored_members', JSON.stringify(filtered));
      }
    );
  },

  // --- SYSTEM SETTINGS API ---
  async getSystemSettings(): Promise<SystemSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('sntn_system_settings').select('*').eq('id', 'global_settings').maybeSingle();
        if (!error && data) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('sntn_system_settings', JSON.stringify(data));
          }
          return data as SystemSettings;
        }
      } catch (e) {
        console.warn('Supabase getSystemSettings error:', e);
      }
    }
    if (typeof window === 'undefined') return {};
    const local = localStorage.getItem('sntn_system_settings');
    return local ? JSON.parse(local) : {};
  },

  async saveSystemSettings(settings: SystemSettings): Promise<void> {
    await executeDbMutation(
      () => supabase!.from('sntn_system_settings').upsert({ id: 'global_settings', ...settings }),
      async () => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('sntn_system_settings', JSON.stringify(settings));
      }
    );
  }
};

