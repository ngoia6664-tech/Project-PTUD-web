/**
 * Dữ liệu giả (mock data) cho khu vực Quản trị (/admin).
 * Cấu trúc dữ liệu mô phỏng response API thật (AdminApiResponse<T>)
 * để sau này thay thế bằng fetch() mà không phải sửa giao diện.
 */

import type { NewsCategory, WeekDay } from "./dashboard";

export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
  fetchedAt: string;
  meta?: {
    total: number;
    page?: number;
    limit?: number;
  };
}

// Thông tin tài khoản quản trị đang thao tác
export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  roleLabel: string;
  avatarInitials: string;
}

// Chỉ số tổng quan trên trang /admin
export interface AdminOverviewStats {
  totalUsers: number;
  usersGrowthPercent: number;
  newUsersThisMonth: number;
  fetchedNewsCount: number;
  lastCrawlAt: string;
  totalDocuments: number;
  pendingDocumentsCount: number;
}

// Điểm dữ liệu cho biểu đồ tăng trưởng người dùng theo tháng
export interface MonthlyGrowthPoint {
  month: string;
  totalUsers: number;
  newUsers: number;
}

// Điểm dữ liệu cho biểu đồ phân bổ tài liệu theo chuyên ngành / nhóm môn
export interface CategoryDistributionPoint {
  label: string;
  count: number;
  color: string;
}

// Bản ghi tin tức trong trang quản trị /admin/news
export interface AdminNewsItem {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  category: NewsCategory;
  isVisible: boolean;
  isPinned: boolean;
}

// Cấu hình nguồn kéo tin tự động
export interface NewsSourceConfig {
  id: string;
  name: string;
  url: string;
  intervalMinutes: number;
  enabled: boolean;
  lastSyncedAt: string;
}

// Buổi học chung do quản trị viên quản lý (/admin/schedule)
export interface AdminScheduleEvent {
  id: string;
  classCode: string; // VD: AT18C, AT19A, CT06B
  courseCode: string;
  courseName: string;
  dayOfWeek: WeekDay;
  startPeriod: number;
  endPeriod: number;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
}

// Thông báo nghỉ / dạy bù / đổi phòng
export interface AdminMakeupNotice {
  id: string;
  classCode: string;
  courseName: string;
  noticeType: "nghi-hoc" | "day-bu" | "doi-phong";
  effectiveDate: string;
  content: string;
  createdAt: string;
}

// Tài khoản người dùng trong hệ thống (/admin/users)
export type UserRole = "student" | "lecturer" | "admin";

export interface AdminUserAccount {
  id: string;
  code: string;
  fullName: string;
  email: string;
  role: UserRole;
  classOrDept: string;
  status: "active" | "locked";
  createdAt: string;
}

// Môn học trong khung chương trình đào tạo (/admin/courses)
export interface AdminCourseItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  major: "ATTT" | "CNTT" | "DTVT";
  category: "bat-buoc" | "tu-chon";
}

// Tài liệu trong trang kiểm duyệt thư viện (/admin/library)
export interface AdminDocumentItem {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  fileType: "PDF" | "SLIDE" | "DOC" | "DE-THI";
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  status: "pending" | "approved";
}

// Quy tắc quy đổi thang điểm (/admin/grading)
export interface AdminGradeScaleRule {
  id: string;
  letter: string;
  minScore10: number;
  maxScore10: number;
  score4: number;
  classification: string;
}

/* ============================================================================
   DỮ LIỆU GIẢ DẠNG API RESPONSE CHO KHU VỰC /ADMIN
   ============================================================================ */

export const MOCK_ADMIN_PROFILE_RESPONSE: AdminApiResponse<AdminProfile> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  data: {
    id: "adm_kma_001",
    fullName: "ThS. Đặng Quốc Bảo",
    email: "admin.portal@actvn.edu.vn",
    roleLabel: "Quản trị hệ thống",
    avatarInitials: "QB",
  },
};

export const MOCK_ADMIN_OVERVIEW_RESPONSE: AdminApiResponse<AdminOverviewStats> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  data: {
    totalUsers: 4826,
    usersGrowthPercent: 12.4,
    newUsersThisMonth: 342,
    fetchedNewsCount: 128,
    lastCrawlAt: "2026-11-22T07:30:00+07:00",
    totalDocuments: 5428,
    pendingDocumentsCount: 14,
  },
};

export const MOCK_MONTHLY_GROWTH_RESPONSE: AdminApiResponse<MonthlyGrowthPoint[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  data: [
    { month: "T6", totalUsers: 3610, newUsers: 185 },
    { month: "T7", totalUsers: 3820, newUsers: 210 },
    { month: "T8", totalUsers: 4055, newUsers: 235 },
    { month: "T9", totalUsers: 4290, newUsers: 290 },
    { month: "T10", totalUsers: 4484, newUsers: 274 },
    { month: "T11", totalUsers: 4826, newUsers: 342 },
  ],
};

export const MOCK_CONTENT_DISTRIBUTION_RESPONSE: AdminApiResponse<
  CategoryDistributionPoint[]
> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  data: [
    { label: "An toàn thông tin", count: 2140, color: "#8b1218" },
    { label: "Công nghệ thông tin", count: 1690, color: "#b8893a" },
    { label: "Điện tử – Viễn thông", count: 960, color: "#156843" },
    { label: "Đại cương & Kỹ năng", count: 638, color: "#2563eb" },
  ],
};

export const MOCK_ADMIN_NEWS_RESPONSE: AdminApiResponse<AdminNewsItem[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 6 },
  data: [
    {
      id: "anews_01",
      title: "Lễ khai giảng năm học 2026 – 2027 & Phát động thi đua học tập tại KMA",
      sourceName: "Cổng thông tin ACTVN",
      sourceUrl: "https://actvn.edu.vn/su-kien/le-khai-giang-2026",
      fetchedAt: "2026-11-22T07:30:00+07:00",
      category: "su-kien",
      isVisible: true,
      isPinned: true,
    },
    {
      id: "anews_02",
      title: "Thông báo mở đơn đăng ký Học bổng Khuyến khích học tập kỳ I/2026",
      sourceName: "Phòng CTSV",
      sourceUrl: "https://actvn.edu.vn/ctsv/hoc-bong-kkht-2026",
      fetchedAt: "2026-11-22T07:30:00+07:00",
      category: "hoc-bong",
      isVisible: true,
      isPinned: true,
    },
    {
      id: "anews_03",
      title: "Hướng dẫn đăng ký học phần học kỳ II năm học 2026 – 2027",
      sourceName: "Phòng Đào tạo",
      sourceUrl: "https://actvn.edu.vn/dao-tao/dang-ky-hoc-phan-hk2",
      fetchedAt: "2026-11-22T06:00:00+07:00",
      category: "hoc-vu",
      isVisible: true,
      isPinned: false,
    },
    {
      id: "anews_04",
      title: "Lịch thi kết thúc học phần đợt 1 các môn cơ sở ngành",
      sourceName: "Phòng Khảo thí",
      sourceUrl: "https://actvn.edu.vn/khao-thi/lich-thi-dot-1",
      fetchedAt: "2026-11-21T18:00:00+07:00",
      category: "hoc-vu",
      isVisible: true,
      isPinned: false,
    },
    {
      id: "anews_05",
      title: "Thông báo bảo trì hệ thống Wi-Fi khu giảng đường TA1 & TA2",
      sourceName: "Trung tâm CNTT",
      sourceUrl: "https://actvn.edu.vn/thong-bao/bao-tri-wifi",
      fetchedAt: "2026-11-21T12:00:00+07:00",
      category: "thong-bao",
      isVisible: false,
      isPinned: false,
    },
    {
      id: "anews_06",
      title: "Ngày hội CLB – Đội – Nhóm KMA 2026 & Giải KMA CTF mở rộng",
      sourceName: "Đoàn Thanh niên KMA",
      sourceUrl: "https://actvn.edu.vn/su-kien/ngay-hoi-clb-2026",
      fetchedAt: "2026-11-20T18:00:00+07:00",
      category: "su-kien",
      isVisible: true,
      isPinned: false,
    },
  ],
};

export const MOCK_NEWS_SOURCES_RESPONSE: AdminApiResponse<NewsSourceConfig[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 3 },
  data: [
    {
      id: "src_01",
      name: "Cổng thông tin Đào tạo KMA",
      url: "https://actvn.edu.vn/dao-tao/rss",
      intervalMinutes: 60,
      enabled: true,
      lastSyncedAt: "2026-11-22T07:30:00+07:00",
    },
    {
      id: "src_02",
      name: "Phòng Công tác Sinh viên & Học bổng",
      url: "https://actvn.edu.vn/ctsv/feed",
      intervalMinutes: 120,
      enabled: true,
      lastSyncedAt: "2026-11-22T07:30:00+07:00",
    },
    {
      id: "src_03",
      name: "Đoàn Thanh niên & CLB Học thuật",
      url: "https://actvn.edu.vn/doan-hoi/news",
      intervalMinutes: 180,
      enabled: false,
      lastSyncedAt: "2026-11-21T18:00:00+07:00",
    },
  ],
};

export const ADMIN_CLASS_OPTIONS = ["AT18C", "AT19A", "CT06B", "DT05A"] as const;

export const MOCK_ADMIN_SCHEDULE_RESPONSE: AdminApiResponse<
  AdminScheduleEvent[]
> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 6 },
  data: [
    {
      id: "asch_01",
      classCode: "AT18C",
      courseCode: "AT1804",
      courseName: "Mật mã học ứng dụng",
      dayOfWeek: 2,
      startPeriod: 1,
      endPeriod: 3,
      startTime: "07:00",
      endTime: "08:50",
      room: "TA2-304",
      lecturer: "TS. Trần Quang Hải",
    },
    {
      id: "asch_02",
      classCode: "AT18C",
      courseCode: "CT0602",
      courseName: "Phát triển ứng dụng Web",
      dayOfWeek: 3,
      startPeriod: 7,
      endPeriod: 9,
      startTime: "13:00",
      endTime: "14:50",
      room: "TA1-402",
      lecturer: "ThS. Lê Minh Đức",
    },
    {
      id: "asch_03",
      classCode: "AT18C",
      courseCode: "AT1811",
      courseName: "An ninh mạng máy tính",
      dayOfWeek: 4,
      startPeriod: 1,
      endPeriod: 3,
      startTime: "07:00",
      endTime: "08:50",
      room: "B203",
      lecturer: "TS. Phạm Ngọc Lan",
    },
    {
      id: "asch_04",
      classCode: "AT19A",
      courseCode: "CT201",
      courseName: "Cấu trúc dữ liệu & Giải thuật",
      dayOfWeek: 2,
      startPeriod: 4,
      endPeriod: 6,
      startTime: "09:00",
      endTime: "10:50",
      room: "TA1-205",
      lecturer: "PGS.TS. Trần Minh Đức",
    },
    {
      id: "asch_05",
      classCode: "CT06B",
      courseCode: "CT308",
      courseName: "Cơ sở dữ liệu nâng cao",
      dayOfWeek: 5,
      startPeriod: 4,
      endPeriod: 6,
      startTime: "09:00",
      endTime: "10:50",
      room: "A201",
      lecturer: "ThS. Lê Thu Hà",
    },
    {
      id: "asch_06",
      classCode: "DT05A",
      courseCode: "DT402",
      courseName: "Xử lý tín hiệu số",
      dayOfWeek: 6,
      startPeriod: 1,
      endPeriod: 3,
      startTime: "07:00",
      endTime: "08:50",
      room: "TA2-501",
      lecturer: "TS. Nguyễn Đức Thắng",
    },
  ],
};

export const MOCK_ADMIN_NOTICES_RESPONSE: AdminApiResponse<AdminMakeupNotice[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 2 },
  data: [
    {
      id: "ntc_01",
      classCode: "AT18C",
      courseName: "Mật mã học ứng dụng",
      noticeType: "doi-phong",
      effectiveDate: "2026-11-25",
      content: "Chuyển phòng học từ TA2-304 sang Lab-B205 để thực hành chứng chỉ số.",
      createdAt: "2026-11-21T16:20:00+07:00",
    },
    {
      id: "ntc_02",
      classCode: "CT06B",
      courseName: "Cơ sở dữ liệu nâng cao",
      noticeType: "day-bu",
      effectiveDate: "2026-11-27",
      content: "Dạy bù ca 4 (15:00 – 16:50) tại phòng A201 do giảng viên đi công tác.",
      createdAt: "2026-11-20T09:15:00+07:00",
    },
  ],
};

export const MOCK_ADMIN_USERS_RESPONSE: AdminApiResponse<AdminUserAccount[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 7 },
  data: [
    {
      id: "u_01",
      code: "AT180324",
      fullName: "Nguyễn Minh Khôi",
      email: "at180324@actvn.edu.vn",
      role: "student",
      classOrDept: "AT18C • ATTT",
      status: "active",
      createdAt: "2022-09-05",
    },
    {
      id: "u_02",
      code: "CT060118",
      fullName: "Trần Thảo Vy",
      email: "ct060118@actvn.edu.vn",
      role: "student",
      classOrDept: "CT06B • CNTT",
      status: "active",
      createdAt: "2023-09-04",
    },
    {
      id: "u_03",
      code: "AT190205",
      fullName: "Lê Hoàng Phúc",
      email: "at190205@actvn.edu.vn",
      role: "student",
      classOrDept: "AT19A • ATTT",
      status: "locked",
      createdAt: "2023-09-04",
    },
    {
      id: "u_04",
      code: "DT050089",
      fullName: "Phạm Gia Huy",
      email: "dt050089@actvn.edu.vn",
      role: "student",
      classOrDept: "DT05A • ĐTVT",
      status: "active",
      createdAt: "2024-09-03",
    },
    {
      id: "u_05",
      code: "GV-AT012",
      fullName: "TS. Trần Quang Hải",
      email: "haitq@actvn.edu.vn",
      role: "lecturer",
      classOrDept: "Khoa An toàn thông tin",
      status: "active",
      createdAt: "2020-02-15",
    },
    {
      id: "u_06",
      code: "GV-CT009",
      fullName: "ThS. Lê Minh Đức",
      email: "duclm@actvn.edu.vn",
      role: "lecturer",
      classOrDept: "Khoa Công nghệ thông tin",
      status: "active",
      createdAt: "2021-08-10",
    },
    {
      id: "u_07",
      code: "ADM-001",
      fullName: "ThS. Đặng Quốc Bảo",
      email: "admin.portal@actvn.edu.vn",
      role: "admin",
      classOrDept: "Trung tâm CNTT KMA",
      status: "active",
      createdAt: "2020-01-01",
    },
  ],
};

export const MOCK_ADMIN_COURSES_RESPONSE: AdminApiResponse<AdminCourseItem[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 8 },
  data: [
    {
      id: "ac_01",
      code: "CB104",
      name: "Nhập môn lập trình C",
      credits: 3,
      semester: 1,
      major: "ATTT",
      category: "bat-buoc",
    },
    {
      id: "ac_02",
      code: "CT201",
      name: "Cấu trúc dữ liệu & Giải thuật",
      credits: 3,
      semester: 2,
      major: "CNTT",
      category: "bat-buoc",
    },
    {
      id: "ac_03",
      code: "CT305",
      name: "Mạng máy tính",
      credits: 3,
      semester: 3,
      major: "CNTT",
      category: "bat-buoc",
    },
    {
      id: "ac_04",
      code: "AT1804",
      name: "Mật mã học ứng dụng",
      credits: 3,
      semester: 4,
      major: "ATTT",
      category: "bat-buoc",
    },
    {
      id: "ac_05",
      code: "CT0602",
      name: "Phát triển ứng dụng Web",
      credits: 3,
      semester: 4,
      major: "CNTT",
      category: "tu-chon",
    },
    {
      id: "ac_06",
      code: "AT1811",
      name: "An ninh mạng máy tính",
      credits: 3,
      semester: 4,
      major: "ATTT",
      category: "bat-buoc",
    },
    {
      id: "ac_07",
      code: "DT402",
      name: "Xử lý tín hiệu số",
      credits: 3,
      semester: 5,
      major: "DTVT",
      category: "bat-buoc",
    },
    {
      id: "ac_08",
      code: "AT599",
      name: "Đồ án tốt nghiệp chuyên ngành ATTT",
      credits: 10,
      semester: 6,
      major: "ATTT",
      category: "bat-buoc",
    },
  ],
};

export const MOCK_ADMIN_LIBRARY_RESPONSE: AdminApiResponse<AdminDocumentItem[]> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 6 },
  data: [
    {
      id: "adoc_01",
      title: "Bộ đề ôn tập Mật mã học ứng dụng HK1 2026",
      courseCode: "AT1804",
      courseName: "Mật mã học ứng dụng",
      fileType: "DE-THI",
      fileSize: "2,4 MB",
      uploadedBy: "Nguyễn Minh Khôi (AT18C)",
      uploadedAt: "2026-11-22",
      status: "pending",
    },
    {
      id: "adoc_02",
      title: "Tổng hợp Lab Pentest OWASP Top 10 (có lời giải)",
      courseCode: "AT1819",
      courseName: "Kiểm thử xâm nhập Web",
      fileType: "PDF",
      fileSize: "5,8 MB",
      uploadedBy: "CLB Học thuật ATTT",
      uploadedAt: "2026-11-21",
      status: "pending",
    },
    {
      id: "adoc_03",
      title: "Bài giảng An toàn thông tin (Bản chính thức)",
      courseCode: "AT1811",
      courseName: "An ninh mạng máy tính",
      fileType: "PDF",
      fileSize: "15,4 MB",
      uploadedBy: "Khoa ATTT",
      uploadedAt: "2026-10-12",
      status: "approved",
    },
    {
      id: "adoc_04",
      title: "Slide Mạng máy tính (Chương 1–7)",
      courseCode: "CT305",
      courseName: "Mạng máy tính",
      fileType: "SLIDE",
      fileSize: "8,7 MB",
      uploadedBy: "ThS. Nguyễn Văn Nam",
      uploadedAt: "2026-11-02",
      status: "approved",
    },
    {
      id: "adoc_05",
      title: "Mẫu báo cáo thực hành Hệ điều hành Linux",
      courseCode: "CT301",
      courseName: "Hệ điều hành",
      fileType: "DOC",
      fileSize: "0,9 MB",
      uploadedBy: "Bộ môn Công nghệ PM",
      uploadedAt: "2026-11-05",
      status: "approved",
    },
    {
      id: "adoc_06",
      title: "Tóm tắt công thức Xử lý tín hiệu số",
      courseCode: "DT402",
      courseName: "Xử lý tín hiệu số",
      fileType: "PDF",
      fileSize: "1,7 MB",
      uploadedBy: "Phạm Gia Huy (DT05A)",
      uploadedAt: "2026-11-20",
      status: "pending",
    },
  ],
};

export const MOCK_ADMIN_GRADING_RESPONSE: AdminApiResponse<
  AdminGradeScaleRule[]
> = {
  success: true,
  fetchedAt: "2026-11-22T07:50:00+07:00",
  meta: { total: 9 },
  data: [
    { id: "gr_01", letter: "A+", minScore10: 9.0, maxScore10: 10.0, score4: 4.0, classification: "Xuất sắc" },
    { id: "gr_02", letter: "A", minScore10: 8.5, maxScore10: 8.9, score4: 3.8, classification: "Giỏi" },
    { id: "gr_03", letter: "B+", minScore10: 7.8, maxScore10: 8.4, score4: 3.5, classification: "Khá giỏi" },
    { id: "gr_04", letter: "B", minScore10: 7.0, maxScore10: 7.7, score4: 3.0, classification: "Khá" },
    { id: "gr_05", letter: "C+", minScore10: 6.3, maxScore10: 6.9, score4: 2.4, classification: "Trung bình khá" },
    { id: "gr_06", letter: "C", minScore10: 5.5, maxScore10: 6.2, score4: 2.0, classification: "Trung bình" },
    { id: "gr_07", letter: "D+", minScore10: 4.8, maxScore10: 5.4, score4: 1.5, classification: "Trung bình yếu" },
    { id: "gr_08", letter: "D", minScore10: 4.0, maxScore10: 4.7, score4: 1.0, classification: "Yếu" },
    { id: "gr_09", letter: "F", minScore10: 0.0, maxScore10: 3.9, score4: 0.0, classification: "Kém (Học lại)" },
  ],
};
