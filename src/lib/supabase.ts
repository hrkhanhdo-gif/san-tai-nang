// Supabase configuration and fallback mock layer
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock database structures and APIs
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

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Talent Acquisition Partner',
    company: 'Tập đoàn Công nghệ NextGen',
    salary: '25,000,000 - 35,000,000 VND',
    location: 'TP. Hồ Chí Minh',
    skills: ['IT Recruitment', 'Headhunting', 'Employer Branding'],
    level: 'Senior',
    type: 'Full-time',
    description: 'Chịu trách nhiệm tìm kiếm nhân sự cấp trung, cấp cao cho mảng Công nghệ thông tin của tập đoàn...',
    created_at: new Date().toISOString(),
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
  },
  {
    id: 'job-3',
    title: 'Headhunter Consultant (HR Tech)',
    company: 'Job Service Connect',
    salary: 'Cạnh tranh + Commission',
    location: 'TP. Hồ Chí Minh',
    skills: ['Executive Search', 'Client Relationship', 'Sourcing'],
    level: 'Senior',
    type: 'Hybrid',
    description: 'Làm việc trực tiếp cùng chị Hằng Nghĩa Thuận để săn tài năng cấp cao cho các doanh nghiệp đối tác lớn...',
    created_at: new Date().toISOString(),
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
  }
];

export const dbHelper = {
  // --- JOBS API ---
  async getJobs(): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Job[];
    }
    
    // Fallback
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

  async addJob(job: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
    const newJob: Job = {
      ...job,
      id: 'job-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .insert([newJob])
        .select();
      if (!error && data && data[0]) return data[0] as Job;
    }

    // Fallback
    if (typeof window !== 'undefined') {
      const currentJobs = await this.getJobs();
      const updatedJobs = [newJob, ...currentJobs];
      localStorage.setItem('sntn_jobs', JSON.stringify(updatedJobs));
    }
    return newJob;
  },

  // --- MEMBERS API (COMMUNITY) ---
  async registerMember(member: Omit<Member, 'id' | 'created_at'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: 'member-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('members')
        .insert([newMember])
        .select();
      if (!error && data && data[0]) return data[0] as Member;
    }

    // Fallback
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

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([newMsg])
        .select();
      if (!error && data && data[0]) return data[0] as ContactMessage;
    }

    // Fallback
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('sntn_messages');
      const messages = local ? JSON.parse(local) : [];
      messages.push(newMsg);
      localStorage.setItem('sntn_messages', JSON.stringify(messages));
    }
    return newMsg;
  }
};
