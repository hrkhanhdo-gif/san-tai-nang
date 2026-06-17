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

const DEFAULT_JOBS: Job[] = [];

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
      if (!localStorage.getItem('sntn_cleared_mock_data_v3')) {
        localStorage.removeItem('sntn_jobs');
        localStorage.removeItem('sntn_activities');
        localStorage.setItem('sntn_cleared_mock_data_v3', 'true');
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

