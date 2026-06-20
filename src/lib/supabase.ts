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
      if (!localStorage.getItem('sntn_cleared_mock_data_v8')) {
        localStorage.removeItem('sntn_jobs');
        localStorage.removeItem('sntn_activities');
        localStorage.removeItem('sntn_org_members');
        localStorage.removeItem('sntn_honored_members');
        localStorage.removeItem('sntn_system_settings');
        localStorage.setItem('sntn_cleared_mock_data_v8', 'true');
      }
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
  async getMembers(): Promise<Member[]> {
    if (typeof window === 'undefined') return [];
    const local = localStorage.getItem('sntn_members');
    return local ? JSON.parse(local) : [];
  },

  async registerMember(member: Omit<Member, 'id' | 'created_at' | 'status'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      status: 'pending',
      id: 'member-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const members = await this.getMembers();
      members.push(newMember);
      localStorage.setItem('sntn_members', JSON.stringify(members));
    }
    return newMember;
  },

  async approveMember(memberId: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const members = await this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      members[idx].status = 'approved';
      localStorage.setItem('sntn_members', JSON.stringify(members));
      return true;
    }
    return false;
  },

  async rejectMember(memberId: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const members = await this.getMembers();
    const idx = members.findIndex(m => m.id === memberId);
    if (idx !== -1) {
      members[idx].status = 'rejected';
      localStorage.setItem('sntn_members', JSON.stringify(members));
      return true;
    }
    return false;
  },
  async saveMember(member: Member): Promise<void> {
    if (typeof window === 'undefined') return;
    const members = await this.getMembers();
    const idx = members.findIndex(m => m.id === member.id);
    if (idx !== -1) {
      members[idx] = member;
    } else {
      members.push(member);
    }
    localStorage.setItem('sntn_members', JSON.stringify(members));
  },
  async deleteMember(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const members = await this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    localStorage.setItem('sntn_members', JSON.stringify(filtered));
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
  },

  // --- ORG MEMBERS API ---
  async getOrgMembers(): Promise<OrgMember[]> {
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
  async saveOrgMember(member: OrgMember): Promise<void> {
    if (typeof window === 'undefined') return;
    const members = await this.getOrgMembers();
    const idx = members.findIndex(m => m.id === member.id);
    if (idx !== -1) {
      members[idx] = member;
    } else {
      members.push(member);
    }
    localStorage.setItem('sntn_org_members', JSON.stringify(members));
  },
  async deleteOrgMember(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const members = await this.getOrgMembers();
    const filtered = members.filter(m => m.id !== id);
    localStorage.setItem('sntn_org_members', JSON.stringify(filtered));
  },

  // --- HONORED MEMBERS API ---
  async getHonoredMembers(): Promise<HonoredMember[]> {
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
  async saveHonoredMember(member: HonoredMember): Promise<void> {
    if (typeof window === 'undefined') return;
    const members = await this.getHonoredMembers();
    const idx = members.findIndex(m => m.id === member.id);
    if (idx !== -1) {
      members[idx] = member;
    } else {
      members.push(member);
    }
    localStorage.setItem('sntn_honored_members', JSON.stringify(members));
  },
  async deleteHonoredMember(id: string): Promise<void> {
    if (typeof window === 'undefined') return;
    const members = await this.getHonoredMembers();
    const filtered = members.filter(m => m.id !== id);
    localStorage.setItem('sntn_honored_members', JSON.stringify(filtered));
  },

  // --- SYSTEM SETTINGS API ---
  async getSystemSettings(): Promise<SystemSettings> {
    if (typeof window === 'undefined') return {};
    const local = localStorage.getItem('sntn_system_settings');
    return local ? JSON.parse(local) : {};
  },
  async saveSystemSettings(settings: SystemSettings): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem('sntn_system_settings', JSON.stringify(settings));
  }
};

