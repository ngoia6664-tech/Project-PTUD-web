/**
 * Dữ liệu giả (mock data) cho khu vực Dashboard Sinh viên (/dashboard).
 * Cấu trúc dữ liệu mô phỏng response API thật (ApiResponse<T>) để sau này
 * có thể thay trực tiếp bằng fetch() mà không cần sửa giao diện.
 */

// Wrapper chuẩn mô phỏng response trả về từ Backend API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  fetchedAt: string;
  meta?: {
    total: number;
    page?: number;
    limit?: number;
  };
}

// Thông tin sinh viên đang đăng nhập
export interface User {
  id: string;
  studentCode: string;
  fullName: string;
  email: string;
  phone: string;
  major: "ATTT" | "CNTT" | "DTVT";
  majorName: string;
  className: string;
  cohort: string;
  academicYear: string;
  avatarInitials: string;
  googleLinked: boolean;
  googleEmail?: string;
  role: "student" | "admin";
  createdAt: string;
}

// Trạng thái học phần trong chương trình đào tạo
export type CourseStatus = "da-hoc" | "dang-hoc" | "chua-hoc";

// Một môn học trong chương trình đào tạo KMA
export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  category: "bat-buoc" | "tu-chon";
  status: CourseStatus;
  format?: "Lý thuyết" | "Thực hành" | "Lý thuyết + Thực hành";
  progress?: number; // % tiến độ hoàn thành trong kỳ (cho môn đang học)
  score10?: number;
  letterGrade?: string;
  score4?: number;
}

// Bản ghi điểm dùng trong công cụ Tính GPA
export interface GpaRecord {
  id: string;
  courseCode: string;
  courseName: string;
  credits: number;
  score10: number;
  semester: string;
}

// Quy tắc quy đổi thang điểm 10 -> điểm chữ -> thang 4 (chuẩn tín chỉ KMA)
export interface GradeRule {
  minScore10: number;
  letter: string;
  score4: number;
  classification: string;
}

// Phân loại tin tức trường
export type NewsCategory = "hoc-vu" | "hoc-bong" | "su-kien" | "thong-bao";

// Một bài tin tức từ cổng thông tin KMA
export interface NewsPost {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  isPinned: boolean;
  isNew: boolean;
  isRead: boolean;
  isSaved: boolean;
  coverTheme: "ceremony" | "scholarship" | "academic" | "event" | "notice";
}

// Thứ trong tuần (Thứ 2 đến Thứ 6 theo chuẩn đã chốt)
export type WeekDay = 2 | 3 | 4 | 5 | 6;

// Nhóm màu hiển thị buổi học trên thời khóa biểu
export type ScheduleEventType = "class" | "lab" | "self" | "personal";

// Một buổi học trên lịch (phân biệt lịch chung của lớp và lịch sinh viên tự thêm)
export interface ScheduleEvent {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  lecturer: string;
  dayOfWeek: WeekDay;
  startPeriod: number; // Tiết bắt đầu (1..15)
  endPeriod: number; // Tiết kết thúc (1..15)
  startTime: string;
  endTime: string;
  color: string;
  eventType: ScheduleEventType;
  source: "class" | "personal"; // "class": chỉ xem | "personal": tự thêm, sửa/xóa được
  repeatWeekly: boolean;
  note?: string;
}

// Một tài liệu trong Thư viện KMA
export interface DocumentItem {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  fileType: "PDF" | "SLIDE" | "DOC" | "DE-THI";
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
  isFavorite: boolean;
  description: string;
  coverLabel: string;
  coverAccent: "crimson" | "gold" | "ivory" | "blue";
}

// Tổng hợp chỉ số cho trang Tổng quan (/dashboard)
export interface DashboardOverview {
  gpaCurrent: number;
  gpaScale: number;
  completedCredits: number;
  totalCredits: number;
  activeCoursesCount: number;
  currentSemester: string;
  nextClass: ScheduleEvent | null;
  latestNews: NewsPost[];
}

/* ============================================================================
   BẢNG QUY ĐỔI THANG ĐIỂM & KHUNG CA/TIẾT HỌC CHUẨN KMA
   ============================================================================ */

export const KMA_GRADE_RULES: GradeRule[] = [
  { minScore10: 9.0, letter: "A+", score4: 4.0, classification: "Xuất sắc" },
  { minScore10: 8.5, letter: "A", score4: 3.8, classification: "Giỏi" },
  { minScore10: 7.8, letter: "B+", score4: 3.5, classification: "Khá giỏi" },
  { minScore10: 7.0, letter: "B", score4: 3.0, classification: "Khá" },
  { minScore10: 6.3, letter: "C+", score4: 2.4, classification: "Trung bình khá" },
  { minScore10: 5.5, letter: "C", score4: 2.0, classification: "Trung bình" },
  { minScore10: 4.8, letter: "D+", score4: 1.5, classification: "Trung bình yếu" },
  { minScore10: 4.0, letter: "D", score4: 1.0, classification: "Yếu" },
  { minScore10: 0.0, letter: "F", score4: 0.0, classification: "Kém (Học lại)" },
];

export function convertScore10(score10: number): GradeRule {
  const safe = Math.max(0, Math.min(10, Number.isNaN(score10) ? 0 : score10));
  for (const rule of KMA_GRADE_RULES) {
    if (safe >= rule.minScore10) return rule;
  }
  return KMA_GRADE_RULES[KMA_GRADE_RULES.length - 1];
}

// 5 ca học chuẩn hiển thị trên lưới Thời khóa biểu tuần (Thứ 2 – Thứ 6)
export interface KmaShiftRow {
  id: number;
  label: string;
  timeRange: string;
  startPeriod: number;
  endPeriod: number;
  start: string;
  end: string;
}

export const KMA_SHIFT_ROWS: KmaShiftRow[] = [
  { id: 1, label: "Ca 1 (Tiết 1–3)", timeRange: "07:00 – 08:50", startPeriod: 1, endPeriod: 3, start: "07:00", end: "08:50" },
  { id: 2, label: "Ca 2 (Tiết 4–6)", timeRange: "09:00 – 10:50", startPeriod: 4, endPeriod: 6, start: "09:00", end: "10:50" },
  { id: 3, label: "Ca 3 (Tiết 7–9)", timeRange: "13:00 – 14:50", startPeriod: 7, endPeriod: 9, start: "13:00", end: "14:50" },
  { id: 4, label: "Ca 4 (Tiết 10–12)", timeRange: "15:00 – 16:50", startPeriod: 10, endPeriod: 12, start: "15:00", end: "16:50" },
  { id: 5, label: "Ca 5 (Tiết 13–15)", timeRange: "17:00 – 18:50", startPeriod: 13, endPeriod: 15, start: "17:00", end: "18:50" },
];

export const KMA_PERIOD_SLOTS = [
  { period: 1, shift: "Ca 1", start: "07:00", end: "07:35" },
  { period: 2, shift: "Ca 1", start: "07:40", end: "08:15" },
  { period: 3, shift: "Ca 1", start: "08:15", end: "08:50" },
  { period: 4, shift: "Ca 2", start: "09:00", end: "09:35" },
  { period: 5, shift: "Ca 2", start: "09:40", end: "10:15" },
  { period: 6, shift: "Ca 2", start: "10:15", end: "10:50" },
  { period: 7, shift: "Ca 3", start: "13:00", end: "13:35" },
  { period: 8, shift: "Ca 3", start: "13:40", end: "14:15" },
  { period: 9, shift: "Ca 3", start: "14:15", end: "14:50" },
  { period: 10, shift: "Ca 4", start: "15:00", end: "15:35" },
  { period: 11, shift: "Ca 4", start: "15:40", end: "16:15" },
  { period: 12, shift: "Ca 4", start: "16:15", end: "16:50" },
  { period: 13, shift: "Ca 5", start: "17:00", end: "17:35" },
  { period: 14, shift: "Ca 5", start: "17:40", end: "18:15" },
  { period: 15, shift: "Ca 5", start: "18:15", end: "18:50" },
] as const;

export const WEEK_DAYS: { day: WeekDay; label: string; short: string; dateHint: string }[] = [
  { day: 2, label: "Thứ Hai", short: "T2", dateHint: "23/11" },
  { day: 3, label: "Thứ Ba", short: "T3", dateHint: "24/11" },
  { day: 4, label: "Thứ Tư", short: "T4", dateHint: "25/11" },
  { day: 5, label: "Thứ Năm", short: "T5", dateHint: "26/11" },
  { day: 6, label: "Thứ Sáu", short: "T6", dateHint: "27/11" },
];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  "hoc-vu": "Học vụ",
  "hoc-bong": "Học bổng",
  "su-kien": "Sự kiện",
  "thong-bao": "Thông báo chung",
};

export const SCHEDULE_TYPE_LABELS: Record<ScheduleEventType, string> = {
  class: "Học trên lớp",
  lab: "Thực hành",
  self: "Tự học / Ôn tập",
  personal: "Sự kiện cá nhân",
};

export function getPeriodTimeRange(startPeriod: number, endPeriod: number): {
  startTime: string;
  endTime: string;
} {
  const s = KMA_PERIOD_SLOTS.find((p) => p.period === startPeriod);
  const e = KMA_PERIOD_SLOTS.find((p) => p.period === endPeriod);
  return {
    startTime: s?.start ?? "07:00",
    endTime: e?.end ?? "08:50",
  };
}

/* ============================================================================
   DỮ LIỆU GIẢ DẠNG API RESPONSE
   ============================================================================ */

export const MOCK_USER_RESPONSE: ApiResponse<User> = {
  success: true,
  fetchedAt: "2026-11-21T08:00:00+07:00",
  data: {
    id: "usr_kma_at180324",
    studentCode: "AT180324",
    fullName: "Nguyễn Minh Khôi",
    email: "at180324@actvn.edu.vn",
    phone: "0984 512 309",
    major: "ATTT",
    majorName: "An toàn thông tin",
    className: "AT18C",
    cohort: "Khóa AT18 (2022 - 2027)",
    academicYear: "Năm thứ 4",
    avatarInitials: "MK",
    googleLinked: false,
    role: "student",
    createdAt: "2022-09-05T00:00:00+07:00",
  },
};

export const MOCK_NEWS_RESPONSE: ApiResponse<NewsPost[]> = {
  success: true,
  fetchedAt: "2026-11-21T08:15:00+07:00",
  meta: { total: 7, page: 1, limit: 20 },
  data: [
    {
      id: "news_001",
      title: "Lễ khai giảng năm học 2026 – 2027 & Phát động thi đua học tập tại KMA",
      summary:
        "Học viện Kỹ thuật Mật mã long trọng tổ chức Lễ khai giảng năm học mới, chào đón tân sinh viên khóa mới và vinh danh các tập thể, sinh viên đạt thành tích xuất sắc.",
      category: "su-kien",
      sourceName: "Ban Truyền thông KMA",
      sourceUrl: "https://actvn.edu.vn/su-kien/le-khai-giang-2026",
      publishedAt: "2026-11-21T07:30:00+07:00",
      isPinned: true,
      isNew: true,
      isRead: false,
      isSaved: true,
      coverTheme: "ceremony",
    },
    {
      id: "news_002",
      title: "Thông báo mở đơn đăng ký Học bổng Khuyến khích học tập kỳ I/2026",
      summary:
        "Sinh viên có GPA từ 3.20 và điểm rèn luyện từ 80 trở lên nộp hồ sơ trực tuyến trước 17h00 ngày 30/11/2026. Quỹ học bổng bổ sung thêm 20 suất doanh nghiệp tài trợ.",
      category: "hoc-bong",
      sourceName: "Phòng Công tác Sinh viên",
      sourceUrl: "https://actvn.edu.vn/ctsv/hoc-bong-kkht-2026",
      publishedAt: "2026-11-20T16:10:00+07:00",
      isPinned: false,
      isNew: true,
      isRead: false,
      isSaved: true,
      coverTheme: "scholarship",
    },
    {
      id: "news_003",
      title: "Hướng dẫn đăng ký học phần học kỳ II năm học 2026 – 2027",
      summary:
        "Chi tiết thời gian mở cổng đăng ký tín chỉ, quy trình và các lưu ý quan trọng dành cho sinh viên các khóa AT18, AT19, CT06, DT05 toàn Học viện.",
      category: "hoc-vu",
      sourceName: "Phòng Đào tạo",
      sourceUrl: "https://actvn.edu.vn/dao-tao/dang-ky-hoc-phan-hk2",
      publishedAt: "2026-11-20T09:45:00+07:00",
      isPinned: false,
      isNew: true,
      isRead: false,
      isSaved: false,
      coverTheme: "academic",
    },
    {
      id: "news_004",
      title: "Ngày hội CLB – Đội – Nhóm KMA 2026 & Giải KMA CTF mở rộng",
      summary:
        "Hơn 30 CLB, đội nhóm hội tụ cùng vòng loại KMA CTF các mảng Web, Pwnable, Reverse và Crypto dành cho toàn thể sinh viên yêu công nghệ.",
      category: "su-kien",
      sourceName: "Đoàn Thanh niên KMA",
      sourceUrl: "https://actvn.edu.vn/su-kien/ngay-hoi-clb-kma-2026",
      publishedAt: "2026-11-18T14:20:00+07:00",
      isPinned: false,
      isNew: false,
      isRead: false,
      isSaved: false,
      coverTheme: "event",
    },
    {
      id: "news_005",
      title: "Lịch thi kết thúc học phần đợt 1 các môn cơ sở ngành ATTT & CNTT",
      summary:
        "Sinh viên tra cứu phòng thi, số báo danh và quy chế mang tài liệu tại cổng thông tin đào tạo. Lưu ý mang thẻ sinh viên khi vào phòng thi.",
      category: "hoc-vu",
      sourceName: "Phòng Khảo thí & ĐBCL",
      sourceUrl: "https://actvn.edu.vn/khao-thi/lich-thi-dot-1",
      publishedAt: "2026-11-17T10:00:00+07:00",
      isPinned: false,
      isNew: false,
      isRead: true,
      isSaved: false,
      coverTheme: "academic",
    },
    {
      id: "news_006",
      title: "Thông báo bảo trì hệ thống Wi-Fi khu giảng đường TA1 & TA2",
      summary:
        "Trung tâm CNTT nâng cấp thiết bị phát sóng khung giờ 18h00–21h00 thứ Sáu. Các phòng thực hành máy tính vẫn sử dụng mạng dây bình thường.",
      category: "thong-bao",
      sourceName: "Trung tâm CNTT KMA",
      sourceUrl: "https://actvn.edu.vn/thong-bao/bao-tri-wifi-ta1-ta2",
      publishedAt: "2026-11-15T15:30:00+07:00",
      isPinned: false,
      isNew: false,
      isRead: true,
      isSaved: false,
      coverTheme: "notice",
    },
    {
      id: "news_007",
      title: "Học bổng thực tập kỹ sư bảo mật Viettel Cyber Security 2027",
      summary:
        "Dành cho sinh viên năm 3, năm 4 ngành ATTT và CNTT. Hỗ trợ trợ cấp hàng tháng và cơ hội thực hiện đồ án tốt nghiệp cùng chuyên gia doanh nghiệp.",
      category: "hoc-bong",
      sourceName: "Trung tâm Hợp tác Doanh nghiệp",
      sourceUrl: "https://actvn.edu.vn/hop-tac/hoc-bong-vcs-2027",
      publishedAt: "2026-11-12T08:00:00+07:00",
      isPinned: false,
      isNew: false,
      isRead: true,
      isSaved: false,
      coverTheme: "scholarship",
    },
  ],
};

export const MOCK_SCHEDULE_RESPONSE: ApiResponse<ScheduleEvent[]> = {
  success: true,
  fetchedAt: "2026-11-21T08:00:00+07:00",
  meta: { total: 9 },
  data: [
    {
      id: "sch_001",
      courseCode: "AT1804",
      courseName: "Mật mã học ứng dụng",
      room: "TA2-304",
      lecturer: "TS. Trần Quang Hải",
      dayOfWeek: 2,
      startPeriod: 1,
      endPeriod: 3,
      startTime: "07:00",
      endTime: "08:50",
      color: "#8b1218",
      eventType: "class",
      source: "class",
      repeatWeekly: true,
      note: "Mang laptop thực hành AES/RSA",
    },
    {
      id: "sch_002",
      courseCode: "STU001",
      courseName: "Tự học, ôn tập",
      room: "Thư viện Tầng 3",
      lecturer: "Tự học cá nhân",
      dayOfWeek: 2,
      startPeriod: 7,
      endPeriod: 9,
      startTime: "13:00",
      endTime: "14:50",
      color: "#7c3aed",
      eventType: "self",
      source: "personal",
      repeatWeekly: true,
      note: "Ôn tập chương 4 mật mã khóa công khai",
    },
    {
      id: "sch_003",
      courseCode: "AT1815",
      courseName: "Phân tích mã độc (TH)",
      room: "P201 (Phòng TH)",
      lecturer: "ThS. Vũ Hoàng Nam",
      dayOfWeek: 3,
      startPeriod: 4,
      endPeriod: 6,
      startTime: "09:00",
      endTime: "10:50",
      color: "#2563eb",
      eventType: "lab",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_004",
      courseCode: "CT0602",
      courseName: "Phát triển ứng dụng Web",
      room: "TA1-402",
      lecturer: "ThS. Lê Minh Đức",
      dayOfWeek: 3,
      startPeriod: 7,
      endPeriod: 9,
      startTime: "13:00",
      endTime: "14:50",
      color: "#8b1218",
      eventType: "class",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_005",
      courseCode: "CLB-ATT",
      courseName: "Sinh hoạt CLB An toàn TT",
      room: "B102",
      lecturer: "CLB KMA SEC",
      dayOfWeek: 3,
      startPeriod: 10,
      endPeriod: 12,
      startTime: "15:00",
      endTime: "16:50",
      color: "#b8893a",
      eventType: "personal",
      source: "personal",
      repeatWeekly: true,
    },
    {
      id: "sch_006",
      courseCode: "AT1811",
      courseName: "An ninh mạng máy tính",
      room: "B203",
      lecturer: "TS. Phạm Ngọc Lan",
      dayOfWeek: 4,
      startPeriod: 1,
      endPeriod: 3,
      startTime: "07:00",
      endTime: "08:50",
      color: "#8b1218",
      eventType: "class",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_007",
      courseCode: "AT1819",
      courseName: "Kiểm thử xâm nhập Web",
      room: "A204",
      lecturer: "ThS. Nguyễn Thành Trung",
      dayOfWeek: 4,
      startPeriod: 10,
      endPeriod: 12,
      startTime: "15:00",
      endTime: "16:50",
      color: "#8b1218",
      eventType: "class",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_008",
      courseCode: "CT308",
      courseName: "Cơ sở dữ liệu nâng cao",
      room: "A201",
      lecturer: "ThS. Lê Thu Hà",
      dayOfWeek: 5,
      startPeriod: 4,
      endPeriod: 6,
      startTime: "09:00",
      endTime: "10:50",
      color: "#8b1218",
      eventType: "class",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_009",
      courseCode: "AT1811-TH",
      courseName: "An ninh mạng (TH)",
      room: "P302 (Phòng TH)",
      lecturer: "TS. Phạm Ngọc Lan",
      dayOfWeek: 5,
      startPeriod: 7,
      endPeriod: 9,
      startTime: "13:00",
      endTime: "14:50",
      color: "#2563eb",
      eventType: "lab",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_010",
      courseCode: "CT305",
      courseName: "Mạng máy tính",
      room: "A102",
      lecturer: "ThS. Nguyễn Văn Nam",
      dayOfWeek: 6,
      startPeriod: 1,
      endPeriod: 3,
      startTime: "07:00",
      endTime: "08:50",
      color: "#8b1218",
      eventType: "class",
      source: "class",
      repeatWeekly: true,
    },
    {
      id: "sch_011",
      courseCode: "STU002",
      courseName: "Tự học, làm bài tập nhóm",
      room: "Thư viện",
      lecturer: "Nhóm 04",
      dayOfWeek: 6,
      startPeriod: 10,
      endPeriod: 12,
      startTime: "15:00",
      endTime: "16:50",
      color: "#7c3aed",
      eventType: "self",
      source: "personal",
      repeatWeekly: false,
      note: "Hoàn thiện giao diện Dashboard KMA Overall",
    },
  ],
};

export const MOCK_CURRICULUM_RESPONSE: ApiResponse<Course[]> = {
  success: true,
  fetchedAt: "2026-11-21T08:00:00+07:00",
  meta: { total: 18 },
  data: [
    // Kỳ 1
    {
      id: "crs_101",
      code: "CB101",
      name: "Giải tích 1",
      credits: 3,
      semester: 1,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết",
      score10: 8.6,
      letterGrade: "A",
      score4: 3.8,
    },
    {
      id: "crs_102",
      code: "CB104",
      name: "Nhập môn lập trình C",
      credits: 3,
      semester: 1,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết + Thực hành",
      score10: 9.1,
      letterGrade: "A+",
      score4: 4.0,
    },
    {
      id: "crs_103",
      code: "CB108",
      name: "Đại số tuyến tính",
      credits: 3,
      semester: 1,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết",
      score10: 7.9,
      letterGrade: "B+",
      score4: 3.5,
    },
    // Kỳ 2
    {
      id: "crs_201",
      code: "CT201",
      name: "Cấu trúc dữ liệu & Giải thuật",
      credits: 3,
      semester: 2,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết + Thực hành",
      score10: 8.7,
      letterGrade: "A",
      score4: 3.8,
    },
    {
      id: "crs_202",
      code: "CT204",
      name: "Kiến trúc máy tính",
      credits: 3,
      semester: 2,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết",
      score10: 7.5,
      letterGrade: "B",
      score4: 3.0,
    },
    {
      id: "crs_203",
      code: "AT202",
      name: "Toán rời rạc & Lý thuyết số",
      credits: 3,
      semester: 2,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết",
      score10: 8.4,
      letterGrade: "B+",
      score4: 3.5,
    },
    // Kỳ 3
    {
      id: "crs_301",
      code: "CT301",
      name: "Hệ điều hành",
      credits: 3,
      semester: 3,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết + Thực hành",
      score10: 8.0,
      letterGrade: "B+",
      score4: 3.5,
    },
    {
      id: "crs_302",
      code: "CT305",
      name: "Mạng máy tính",
      credits: 3,
      semester: 3,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết + Thực hành",
      score10: 8.8,
      letterGrade: "A",
      score4: 3.8,
    },
    {
      id: "crs_303",
      code: "CT308",
      name: "Cơ sở dữ liệu",
      credits: 3,
      semester: 3,
      category: "bat-buoc",
      status: "da-hoc",
      format: "Lý thuyết + Thực hành",
      score10: 8.2,
      letterGrade: "B+",
      score4: 3.5,
    },
    // Kỳ 4 (Đang học)
    {
      id: "crs_401",
      code: "AT1804",
      name: "Mật mã học ứng dụng",
      credits: 3,
      semester: 4,
      category: "bat-buoc",
      status: "dang-hoc",
      format: "Lý thuyết",
      progress: 70,
    },
    {
      id: "crs_402",
      code: "CT0602",
      name: "Phát triển ứng dụng Web",
      credits: 3,
      semester: 4,
      category: "tu-chon",
      status: "dang-hoc",
      format: "Lý thuyết + Thực hành",
      progress: 60,
    },
    {
      id: "crs_403",
      code: "AT1811",
      name: "An ninh mạng máy tính",
      credits: 3,
      semester: 4,
      category: "bat-buoc",
      status: "dang-hoc",
      format: "Lý thuyết + Thực hành",
      progress: 85,
    },
    {
      id: "crs_404",
      code: "AT1815",
      name: "Phân tích mã độc cơ bản",
      credits: 3,
      semester: 4,
      category: "bat-buoc",
      status: "dang-hoc",
      format: "Thực hành",
      progress: 50,
    },
    {
      id: "crs_405",
      code: "AT1819",
      name: "Kiểm thử xâm nhập Web",
      credits: 3,
      semester: 4,
      category: "tu-chon",
      status: "dang-hoc",
      format: "Thực hành",
      progress: 40,
    },
    // Kỳ 5 & 6 (Chưa học)
    {
      id: "crs_501",
      code: "AT501",
      name: "Điều tra số (Digital Forensics)",
      credits: 3,
      semester: 5,
      category: "bat-buoc",
      status: "chua-hoc",
      format: "Lý thuyết + Thực hành",
    },
    {
      id: "crs_502",
      code: "AT504",
      name: "An toàn hệ thống đám mây",
      credits: 3,
      semester: 5,
      category: "tu-chon",
      status: "chua-hoc",
      format: "Lý thuyết",
    },
    {
      id: "crs_503",
      code: "AT509",
      name: "Quản trị rủi ro & Tiêu chuẩn ISO 27001",
      credits: 2,
      semester: 5,
      category: "bat-buoc",
      status: "chua-hoc",
      format: "Lý thuyết",
    },
    {
      id: "crs_504",
      code: "AT599",
      name: "Đồ án tốt nghiệp chuyên ngành ATTT",
      credits: 10,
      semester: 6,
      category: "bat-buoc",
      status: "chua-hoc",
      format: "Thực hành",
    },
  ],
};

export const MOCK_GPA_BASE = {
  previousCredits: 92,
  previousGpa4: 3.44,
  totalProgramCredits: 150,
};

export const MOCK_GPA_RECORDS_RESPONSE: ApiResponse<GpaRecord[]> = {
  success: true,
  fetchedAt: "2026-11-21T08:00:00+07:00",
  meta: { total: 5 },
  data: [
    {
      id: "gpa_01",
      courseCode: "AT1804",
      courseName: "Mật mã học ứng dụng",
      credits: 3,
      score10: 8.6,
      semester: "HK1 2026–2027",
    },
    {
      id: "gpa_02",
      courseCode: "CT0602",
      courseName: "Phát triển ứng dụng Web",
      credits: 3,
      score10: 9.0,
      semester: "HK1 2026–2027",
    },
    {
      id: "gpa_03",
      courseCode: "AT1811",
      courseName: "An ninh mạng máy tính",
      credits: 3,
      score10: 7.9,
      semester: "HK1 2026–2027",
    },
    {
      id: "gpa_04",
      courseCode: "AT1815",
      courseName: "Phân tích mã độc cơ bản",
      credits: 3,
      score10: 8.2,
      semester: "HK1 2026–2027",
    },
    {
      id: "gpa_05",
      courseCode: "AT1819",
      courseName: "Kiểm thử xâm nhập Web",
      credits: 3,
      score10: 8.8,
      semester: "HK1 2026–2027",
    },
  ],
};

export const MOCK_LIBRARY_RESPONSE: ApiResponse<DocumentItem[]> = {
  success: true,
  fetchedAt: "2026-11-21T08:00:00+07:00",
  meta: { total: 8 },
  data: [
    {
      id: "doc_001",
      title: "Bài giảng An toàn thông tin",
      courseCode: "AT1811",
      courseName: "An ninh mạng máy tính",
      fileType: "PDF",
      fileSize: "15,4 MB",
      uploadedBy: "Khoa ATTT",
      uploadedAt: "2026-10-12",
      downloads: 24891,
      isFavorite: false,
      description:
        "Giáo trình chính thức, bao gồm lý thuyết nền tảng, ví dụ và bài tập minh họa.",
      coverLabel: "AN TOÀN THÔNG TIN",
      coverAccent: "crimson",
    },
    {
      id: "doc_002",
      title: "Slide Mạng máy tính",
      courseCode: "CT305",
      courseName: "Mạng máy tính",
      fileType: "SLIDE",
      fileSize: "8,7 MB",
      uploadedBy: "ThS. Nguyễn Văn Nam",
      uploadedAt: "2026-11-02",
      downloads: 12403,
      isFavorite: true,
      description:
        "Toàn bộ slide bài giảng 7 tầng OSI, TCP/IP có sơ đồ minh họa và ví dụ thực tế.",
      coverLabel: "MẠNG MÁY TÍNH",
      coverAccent: "gold",
    },
    {
      id: "doc_003",
      title: "Đề thi cuối kỳ - Mật mã học (2025)",
      courseCode: "AT1804",
      courseName: "Mật mã học ứng dụng",
      fileType: "DE-THI",
      fileSize: "2,1 MB",
      uploadedBy: "Khoa Mật mã",
      uploadedAt: "2026-10-25",
      downloads: 8920,
      isFavorite: false,
      description:
        "Đề thi chính thức kèm đáp án gợi ý và thang điểm tham khảo các hệ mã AES, RSA.",
      coverLabel: "ĐỀ THI CUỐI KỲ",
      coverAccent: "ivory",
    },
    {
      id: "doc_004",
      title: "Mẫu báo cáo thực hành Hệ điều hành",
      courseCode: "CT301",
      courseName: "Hệ điều hành",
      fileType: "DOC",
      fileSize: "0,9 MB",
      uploadedBy: "Bộ môn Công nghệ PM",
      uploadedAt: "2026-11-05",
      downloads: 6315,
      isFavorite: false,
      description:
        "Mẫu báo cáo chuẩn định dạng, hướng dẫn nội dung thí nghiệm Linux và cách trình bày.",
      coverLabel: "BÁO CÁO THỰC HÀNH",
      coverAccent: "blue",
    },
    {
      id: "doc_005",
      title: "Giáo trình Cấu trúc dữ liệu và Giải thuật",
      courseCode: "CT201",
      courseName: "Cấu trúc dữ liệu & Giải thuật",
      fileType: "PDF",
      fileSize: "21,6 MB",
      uploadedBy: "PGS.TS. Trần Minh Đức",
      uploadedAt: "2026-09-20",
      downloads: 18274,
      isFavorite: true,
      description:
        "Giáo trình đầy đủ cây, đồ thị, quy hoạch động kèm hệ thống bài tập và lời giải chọn lọc.",
      coverLabel: "CẤU TRÚC DỮ LIỆU",
      coverAccent: "crimson",
    },
    {
      id: "doc_006",
      title: "Slide Cơ sở dữ liệu",
      courseCode: "CT308",
      courseName: "Cơ sở dữ liệu",
      fileType: "SLIDE",
      fileSize: "12,3 MB",
      uploadedBy: "ThS. Lê Thu Hà",
      uploadedAt: "2026-09-14",
      downloads: 11562,
      isFavorite: false,
      description:
        "Slide bài giảng mô hình ER, chuẩn hóa lược đồ, truy vấn SQL và tối ưu chỉ mục.",
      coverLabel: "CƠ SỞ DỮ LIỆU",
      coverAccent: "gold",
    },
    {
      id: "doc_007",
      title: "Đề thi giữa kỳ - Kiểm thử xâm nhập Web",
      courseCode: "AT1819",
      courseName: "Kiểm thử xâm nhập Web",
      fileType: "DE-THI",
      fileSize: "1,8 MB",
      uploadedBy: "Khoa ATTT",
      uploadedAt: "2026-10-01",
      downloads: 9307,
      isFavorite: false,
      description:
        "Bộ câu hỏi lý thuyết OWASP Top 10 và kịch bản đánh giá lỗ hổng kèm đáp án tham khảo.",
      coverLabel: "ĐỀ THI GIỮA KỲ",
      coverAccent: "ivory",
    },
    {
      id: "doc_008",
      title: "Đề bài & Yêu cầu Bài tập lớn PTUD Web",
      courseCode: "CT0602",
      courseName: "Phát triển ứng dụng Web",
      fileType: "DOC",
      fileSize: "1,2 MB",
      uploadedBy: "ThS. Lê Minh Đức",
      uploadedAt: "2026-10-28",
      downloads: 7845,
      isFavorite: true,
      description:
        "Đặc tả yêu cầu chức năng, tiêu chí đánh giá giao diện, API và hướng dẫn bảo vệ đồ án.",
      coverLabel: "BÀI TẬP LỚN WEB",
      coverAccent: "blue",
    },
  ],
};

export const MOCK_OVERVIEW_RESPONSE: ApiResponse<DashboardOverview> = {
  success: true,
  fetchedAt: "2026-11-21T08:15:00+07:00",
  data: {
    gpaCurrent: 3.48,
    gpaScale: 4.0,
    completedCredits: 107,
    totalCredits: 150,
    activeCoursesCount: 5,
    currentSemester: "Học kỳ 1 (2026 – 2027)",
    nextClass: MOCK_SCHEDULE_RESPONSE.data[0],
    latestNews: MOCK_NEWS_RESPONSE.data.slice(0, 3),
  },
};
