-- HƯỚNG DẪN CẤU HÌNH SUPABASE CHO SĂN TÀI NĂNG (HR COMMUNITY)
-- 
-- Bước 1: Truy cập vào trang quản trị Supabase Dashboard (https://supabase.com).
-- Bước 2: Chọn dự án của bạn, sau đó vào mục "SQL Editor" ở menu bên trái.
-- Bước 3: Tạo một truy vấn mới (New query), copy toàn bộ đoạn mã SQL dưới đây và dán vào.
-- Bước 4: Nhấn nút "Run" để khởi tạo toàn bộ cấu trúc bảng cơ sở dữ liệu.

-- 1. BẢNG VIỆC LÀM (sntn_jobs)
create table if not exists sntn_jobs (
  id text primary key,
  title text not null,
  company text not null,
  salary text not null,
  location text not null,
  skills text[] not null default '{}',
  level text not null,
  type text not null,
  description text,
  requirements text,
  benefits text,
  "workingTime" text,
  "workingAddress" text,
  "isHeadhunt" boolean not null default false,
  "referralCommission" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  posted_by text,
  approved boolean not null default false
);

-- 2. BẢNG ĐƠN ỨNG TUYỂN / CVS (sntn_applications)
create table if not exists sntn_applications (
  id text primary key,
  "jobId" text not null,
  "jobTitle" text not null,
  company text not null,
  "fullName" text not null,
  email text not null,
  phone text not null,
  linkedin text not null,
  "cvLink" text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  "referrerName" text,
  "referrerEmail" text,
  "referrerPhone" text,
  "isReferral" boolean not null default false
);

-- 3. BẢNG ĐĂNG KÝ THÀNH VIÊN MỚI (sntn_members)
create table if not exists sntn_members (
  id text primary key,
  "fullName" text not null,
  email text not null,
  phone text not null,
  company text not null,
  title text not null,
  linkedin text not null,
  experience integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'pending'
);

-- 4. BẢNG TIN NHẮN LIÊN HỆ (sntn_messages)
create table if not exists sntn_messages (
  id text primary key,
  "fullName" text not null,
  email text not null,
  phone text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BẢNG HOẠT ĐỘNG CỘNG ĐỒNG (sntn_activities)
create table if not exists sntn_activities (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  "date" text not null,
  attendees integer not null default 0,
  likes text[] not null default '{}',
  comments jsonb not null default '[]'::jsonb,
  "imageType" text,
  images text[] not null default '{}',
  "showOnHomepage" boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BẢNG SƠ ĐỒ THÀNH VIÊN / ORG CHART (sntn_org_members)
create table if not exists sntn_org_members (
  id text primary key,
  name text not null,
  role text not null,
  company text not null,
  image text not null,
  "roleType" text not null,
  department text,
  "parentLeaderId" text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. BẢNG THÀNH VIÊN VINH DANH (sntn_honored_members)
create table if not exists sntn_honored_members (
  id text primary key,
  name text,
  company text,
  title text,
  image text not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. BẢNG THIẾT LẬP HỆ THỐNG / SETTINGS (sntn_system_settings)
create table if not exists sntn_system_settings (
  id text primary key default 'global_settings',
  "homepageBannerImage" text,
  
  founder1_name text,
  founder1_role text,
  founder1_image text,
  founder1_quote text,
  
  founder2_name text,
  founder2_role text,
  founder2_image text,
  founder2_quote text,
  
  founder3_name text,
  founder3_role text,
  founder3_image text,
  founder3_quote text,
  
  "thuanHn_about1" text,
  "thuanHn_about2" text,
  "thuanHn_about3" text,
  "thuanHn_role" text,
  "thuanHn_image" text,
  "thuanHn_phone" text,
  "thuanHn_email" text,
  "thuanHn_address" text
);

-- CHÈN MẪU THIẾT LẬP MẶC ĐỊNH CHO HỆ THỐNG (Nếu chưa có)
insert into sntn_system_settings (id) values ('global_settings') on conflict (id) do nothing;
