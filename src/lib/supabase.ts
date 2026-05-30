// Supabase configuration and fallback mock layer
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
  imageType: 'books' | 'handshake' | 'briefcase' | 'target' | 'party' | 'coffee';
  created_at: string;
}

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Talent Acquisition Partner',
    company: 'Tập đoàn Công nghệ NextGen',
    salary: '25,000,000 - 35,000,000 VND',
    location: 'TP. Hồ Chí Minh',
    skills: ['IT Recruitment', 'Headhunting', 'Employer Branding', 'Headhunt'],
    level: 'Senior',
    type: 'Full-time',
    description: 'Chịu trách nhiệm tìm kiếm nhân sự cấp trung, cấp cao cho mảng Công nghệ thông tin của tập đoàn...',
    created_at: new Date().toISOString(),
    posted_by: 'admin@sntn.vn',
    approved: true,
  },
  {
    id: 'job-2',
    title: 'HRBP Manager',
    company: 'Công ty Cổ phần Bán lẻ SunGroup',
    salary: '35,000,000 - 45,000,000 VND',
    location: 'Hà Nội',
    skills: ['HR Strategy', 'Employee Relations', 'Performance Management'],
    level: 'Manager',
    type: 'Full-time',
    description: 'Đồng hành cùng ban lãnh đạo mảng bán lẻ thiết lập các kế hoạch phát triển nhân sự toàn diện...',
    created_at: new Date().toISOString(),
    posted_by: 'admin@sntn.vn',
    approved: true,
  },
  {
    id: 'job-3',
    title: 'Headhunter Consultant (HR Tech)',
    company: 'Job Service',
    salary: 'Cạnh tranh + Commission',
    location: 'TP. Hồ Chí Minh',
    skills: ['Executive Search', 'Client Relationship', 'Sourcing', 'Headhunt'],
    level: 'Senior',
    type: 'Hybrid',
    description: 'Làm việc trực tiếp cùng chị Hàng Nghĩa Thuận để săn tài năng cấp cao cho các doanh nghiệp đối tác lớn...',
    created_at: new Date().toISOString(),
    posted_by: 'admin@sntn.vn',
    approved: true,
  },
  {
    id: 'job-4',
    title: 'Giám đốc Nhân sự (CHRO)',
    company: 'Tập đoàn Sản xuất & Logistics Minh Phát',
    salary: '60,000,000 - 80,000,000 VND',
    location: 'Toàn quốc',
    skills: ['HR Management', 'Organizational Development', 'Union Negotiations'],
    level: 'Director',
    type: 'Full-time',
    description: 'Định hình chiến lược nhân sự dài hạn phục vụ cho kế hoạch mở rộng chi nhánh quốc tế của tập đoàn...',
    created_at: new Date().toISOString(),
    posted_by: 'admin@sntn.vn',
    approved: true,
  },
  {
    id: 'job-5',
    title: 'Chuyên viên Tuyển dụng & Đào tạo',
    company: 'Đồng Tâm Group',
    salary: '15,000,000 - 22,000,000 VND',
    location: 'Long An',
    skills: ['Recruitment', 'Training Plan', 'Internal Communication'],
    level: 'Junior / Middle',
    type: 'Full-time',
    description: 'Thực hiện công tác thu hút ứng viên ngành sản xuất vật liệu và điều phối các khóa đào tạo nội bộ...',
    created_at: new Date().toISOString(),
    posted_by: 'admin@sntn.vn',
    approved: true,
  }
];

const DEFAULT_ACTIVITIES: CommunityActivity[] = [
  {
    id: 'act-1',
    title: 'Workshop: Xây dựng Personal Brand trên LinkedIn',
    category: 'Workshop',
    description: 'Workshop chia sẻ kinh nghiệm xây dựng thương hiệu cá nhân hiệu quả.',
    date: '15/04/2024',
    attendees: 45,
    likes: ['partner@sntn.vn'],
    comments: [
      {
        id: 'c-1',
        userEmail: 'partner@sntn.vn',
        userName: 'Nguyễn Minh Partner',
        userRole: 'partner',
        content: 'Chương trình cực kỳ thực chiến, rất mong chờ buổi Offline tiếp theo!',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      }
    ],
    imageType: 'books',
    created_at: new Date().toISOString()
  },
  {
    id: 'act-2',
    title: 'Networking Night: Kết nối C-Level Executives',
    category: 'Networking',
    description: 'Buổi gặp gỡ kết nối với các nhà quản lý cấp cao.',
    date: '10/04/2024',
    attendees: 60,
    likes: [],
    comments: [],
    imageType: 'handshake',
    created_at: new Date().toISOString()
  },
  {
    id: 'act-3',
    title: 'Seminar: Xu hướng HR 2024',
    category: 'Seminar',
    description: 'Cập nhật xu hướng và công nghệ mới trong quản trị nhân sự.',
    date: '05/04/2024',
    attendees: 120,
    likes: ['admin@sntn.vn'],
    comments: [],
    imageType: 'briefcase',
    created_at: new Date().toISOString()
  },
  {
    id: 'act-4',
    title: 'Workshop: Kỹ năng phỏng vấn cho ứng viên cấp cao',
    category: 'Workshop',
    description: 'Buổi thực hành kỹ năng phỏng vấn tuyển chọn, thiết lập AOP thực chiến.',
    date: '20/03/2024',
    attendees: 35,
    likes: [],
    comments: [],
    imageType: 'target',
    created_at: new Date().toISOString()
  },
  {
    id: 'act-5',
    title: 'Year-end Party 2023: Gala kết nối cộng đồng',
    category: 'Sự kiện',
    description: 'Sự kiện giao lưu cuối năm ấm cúng dành cho toàn thể thành viên.',
    date: '28/12/2023',
    attendees: 150,
    likes: ['partner@sntn.vn', 'admin@sntn.vn'],
    comments: [],
    imageType: 'party',
    created_at: new Date().toISOString()
  },
  {
    id: 'act-6',
    title: 'Coffee Talk: Chuyện nghề IT Recruitment',
    category: 'Networking',
    description: 'Thảo luận thân mật về khó khăn và giải pháp tuyển dụng nhân sự IT.',
    date: '12/12/2023',
    attendees: 25,
    likes: [],
    comments: [],
    imageType: 'coffee',
    created_at: new Date().toISOString()
  }
];

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

  async addJob(job: Omit<Job, 'id' | 'created_at' | 'approved' | 'posted_by'>, postedByEmail?: string, approveImmediately = false): Promise<Job> {
    const newJob: Job = {
      ...job,
      id: 'job-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      posted_by: postedByEmail || 'guest',
      approved: approveImmediately
    };

    if (typeof window !== 'undefined') {
      const currentJobs = await this.getJobs();
      const updatedJobs = [newJob, ...currentJobs];
      localStorage.setItem('sntn_jobs', JSON.stringify(updatedJobs));
    }
    return newJob;
  },

  async approveJob(jobId: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const currentJobs = await this.getJobs();
    const idx = currentJobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      currentJobs[idx].approved = true;
      localStorage.setItem('sntn_jobs', JSON.stringify(currentJobs));
      return true;
    }
    return false;
  },

  async editJob(jobId: string, updatedData: Partial<Omit<Job, 'id' | 'created_at' | 'posted_by'>>): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const currentJobs = await this.getJobs();
    const idx = currentJobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      currentJobs[idx] = {
        ...currentJobs[idx],
        ...updatedData
      };
      localStorage.setItem('sntn_jobs', JSON.stringify(currentJobs));
      return true;
    }
    return false;
  },

  async deleteJob(jobId: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const currentJobs = await this.getJobs();
    const updated = currentJobs.filter(j => j.id !== jobId);
    localStorage.setItem('sntn_jobs', JSON.stringify(updated));
    return true;
  },

  // --- JOB APPLICATIONS (CVs) API ---
  async getApplications(): Promise<JobApplication[]> {
    if (typeof window === 'undefined') return [];
    const local = localStorage.getItem('sntn_applications');
    return local ? JSON.parse(local) : [];
  },

  async addApplication(app: Omit<JobApplication, 'id' | 'created_at'>): Promise<JobApplication> {
    const newApp: JobApplication = {
      ...app,
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      const apps = await this.getApplications();
      const updated = [newApp, ...apps];
      localStorage.setItem('sntn_applications', JSON.stringify(updated));
    }
    return newApp;
  },

  // --- MEMBERS API (COMMUNITY REGISTRATION) ---
  async registerMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: 'member-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('sntn_members');
      const members = local ? JSON.parse(local) : [];
      members.push(newMember);
      localStorage.setItem('sntn_members', JSON.stringify(members));
    }
    return newMember;
  },

  // --- CONTACT MESSAGES API ---
  async sendContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('sntn_messages');
      const messages = local ? JSON.parse(local) : [];
      messages.push(newMsg);
      localStorage.setItem('sntn_messages', JSON.stringify(messages));
    }
    return newMsg;
  },

  // --- COMMUNITY ACTIVITIES API ---
  async getActivities(): Promise<CommunityActivity[]> {
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

  async addActivity(act: Omit<CommunityActivity, 'id' | 'created_at' | 'likes' | 'comments'>): Promise<CommunityActivity> {
    const newAct: CommunityActivity = {
      ...act,
      id: 'act-' + Math.random().toString(36).substr(2, 9),
      likes: [],
      comments: [],
      created_at: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      const activities = await this.getActivities();
      const updated = [newAct, ...activities];
      localStorage.setItem('sntn_activities', JSON.stringify(updated));
    }
    return newAct;
  },

  async toggleLikeActivity(activityId: string, userEmail: string): Promise<string[]> {
    if (typeof window === 'undefined') return [];
    const activities = await this.getActivities();
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
      return likes;
    }
    return [];
  },

  async addCommentToActivity(activityId: string, comment: Omit<ActivityComment, 'id' | 'created_at'>): Promise<ActivityComment> {
    const newComment: ActivityComment = {
      ...comment,
      id: 'comment-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      const activities = await this.getActivities();
      const idx = activities.findIndex(a => a.id === activityId);
      if (idx !== -1) {
        activities[idx].comments = [...(activities[idx].comments || []), newComment];
        localStorage.setItem('sntn_activities', JSON.stringify(activities));
      }
    }
    return newComment;
  }
};

