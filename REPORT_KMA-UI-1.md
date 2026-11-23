# Báo cáo KMA-UI-1 — antigravity

Hoàn tất chỉnh giao diện bài tập lớn KMA Overall (`/dashboard/*` và `/admin/*`) trên nhánh mới `ui/kma-ui-1` (5 commit `KMA-UI-1:`) bám sát `KMA_DAC_TA_GIAO_DIEN.md` và các quyết định Q1–Q9 của Anh.
Đã thay banner trang con bằng `DashboardPageHeader` gọn (~130px), chỉ Tổng quan giữ banner (238px ≤ 280px) và đưa Tổng quan về đúng 3 thẻ lối tắt; đổi font tiêu đề sang Lora (weight ≤ 700, line-height ≥ 1.28), nội dung Be Vietnam Pro, root `lang="vi"` nền kem; rút navbar sinh viên về 5 tab (Học tập sáng ở 3 trang con).
Đã bổ sung motion đủ đặc tả: 1 pill trượt 800ms bằng `transform` (ngang ở user, dọc ở admin), biểu đồ vẽ dần 1 lần qua IntersectionObserver, donut tính số thật từ dữ liệu, KPI đếm từ 0, chuyển trang chỉ mờ 250ms, card so le 40ms, bỏ hoàn toàn `backdrop-filter` trong phạm vi dashboard/admin.
Đã triển khai trạng thái dùng chung (`?demo=loading|empty|error`), gỡ hết công tắc demo khỏi giao diện, thống nhất bo góc thẻ 16px, bổ sung `aria-current="page"` và `prefers-reduced-motion: reduce` đầy đủ cho cả hai khu vực.
Đã kiểm chứng trên Chrome Headless đủ 30 ảnh thật (15 trang × 1440×900 & 375×812 tại `_shots/`), 0 lỗi console, 0 tràn ngang, sửa dứt điểm lỗi chồng chữ header admin ở 375px; `tsc --noEmit`, `eslint` và `npm run build` đều đạt exit 0.
Còn lại một vài tiểu tiết nâng cao so với đặc tả (như phân trang bảng B4, mở ngăn kéo riêng thay vì form nội tuyến ở A3/B3/B5/B6, hay giữ lịch T2–T6 theo dữ liệu mock cũ) đã ghi rõ trong bảng đối chiếu để Anh xem xét bước sau.

## TRẠNG THÁI
XONG

## GIAO BỞI
Prompt nhiệm vụ `KMA-UI-1` (23/11/2026) dựa trên đặc tả `D:/wt/dau-nao/ngoai_du_an/KMA_DAC_TA_GIAO_DIEN.md` và báo cáo `D:/wt/dau-nao/ngoai_du_an/DANH_GIA_UI_UX.md`.

## ĐÃ LÀM

| việc | commit hoặc file | bằng chứng (số test, mã HTTP, ảnh…) |
|---|---|---|
| Kiểm nền & tách nhánh `ui/kma-ui-1` từ `UI/Dashboard-user-admin` (không đụng 3 file chưa commit của `01_backend/`) | Nhánh `ui/kma-ui-1` (từ `e2824d5`) | Baseline `tsc --noEmit` exit 0; `next build` 22/22 static routes. `git status --short` giữ nguyên 3 file `01_backend/` chưa chạm. |
| Font Lora (≤700, line-height ≥1.28), Be Vietnam Pro, root `lang="vi"` nền kem `#faf6ef`, metadata `KMA Overall`, token dùng chung, bỏ `backdrop-filter`, bo góc 16px, chuyển trang chỉ mờ 250ms | `e322b09` (`app/layout.tsx`, `app/globals.css`, `app/dashboard/layout.tsx`, `app/admin/layout.tsx`, `components/ui/kma-tokens.css`, `dashboard.css`, `admin.css`) | `grep "backdrop-filter"` trong `components/dashboard`, `components/admin`, `components/ui`, `app` = `0` (chỉ còn `components/home/home.css` ngoài phạm vi, không sửa); `grep "font-weight: 800"` toàn bộ `components/` & `app/` = `0`. Chrome computed: `h1Font: Lora`, `h1Weight: 700`, `bodyFont: Be Vietnam Pro`. |
| Navbar user 5 tab (Tổng quan, Tin tức, Lịch học, Học tập, Battle Royale), avatar menu đủ 4 mục (Hồ sơ, Chuyển Admin, Về Home, Đăng xuất), chuông hiện số chưa đọc, 1 pill trượt 800ms `transform` cho user & admin, `aria-current="page"` | `aad3677` (`DashboardNavbar.tsx`, `AdminSidebar.tsx`) | Chrome 1280px trên `/dashboard/gpa`: `tabCount: 5`, `fontSize: 14.24px`, `overflowX: false`, tab `Học tập` có `aria-current="page"` trên cả 3 trang con (`/dashboard/gpa`, `/dashboard/curriculum`, `/dashboard/library`). Admin sidebar có `aria-current="page"` & pill trượt dọc (`matrix(1,0,0,1,0,48..291)`). |
| Page header gọn (~130px) cho 7 trang con user; Tổng quan giữ banner (238px ≤ 280px), 4 KPI đếm số + sparkline/vòng 71%, Hôm nay & buổi học tiếp theo (nhãn "Sắp diễn ra"), 3 tin mới, đúng 3 thẻ lối tắt (đã bỏ khối 5 tiện ích & banner đỏ cuối trang lệch đặc tả A1) | `fdc0f9e` (`DashboardPageHeader.tsx`, `OverviewStats.tsx`, `NextClassCard.tsx`, `OverviewShortcuts.tsx`, `app/dashboard/*`) | Ảnh `A1_dashboard_1440.png` (`heroHeight: 238px`), `A2..A8` (`pageHeaderHeight: 130px`, A7 thêm 3 số liệu = `172px`). Bỏ nút công tắc demo trên `/dashboard/news`. |
| Motion biểu đồ vẽ dần 1 lần (IntersectionObserver: cột mọc so le 60ms + đường `stroke-dashoffset` + vùng tô + điểm nảy + donut vẽ từng cung, số giữa tính thật `5.428 tài liệu` không cứng `100%`), KPI đếm từ 0, card so le 40ms, `?demo=loading\|empty\|error` trên cả user & admin | `cf7d00f` (`useInViewOnce.ts`, `AnimatedNumber.tsx`, `useDemoState.ts`, `DataStates.tsx`, `AdminOverviewStats.tsx`, `AdminCharts.tsx`, `app/admin/*`) | 9/9 kiểm tra `?demo=loading\|empty\|error` trên `/dashboard/news`, `/dashboard/schedule`, `/dashboard/library`, `/dashboard/curriculum`, `/admin/users` đều trả đúng Skeleton / Empty / Error + nút "Thử lại". Reduced-motion qua CDP (`Emulation.setEmulatedMedia`): `/dashboard` & `/admin` trả `stageAnim: "none"`, `pillTransition: "0s"`, số KPI hiện ngay (`3.48`, `4.826`). |
| Sửa lỗi chồng chữ header admin ở màn hình mobile 375px (phát hiện khi xem ảnh `B1_admin_375.png`) | `e047015` (`AdminHeader.tsx`, `admin.css`) | Re-capture 7 ảnh `B1..B7_375.png`; kiểm mắt `B1_admin_375.png` sạch, 0 chồng chữ, 0 tràn ngang. |
| Build, Typecheck, Lint & Chụp 30 ảnh thật (15 trang × 1440×900 & 375×812) | `D:/Project-PTUD-web/_shots/` (30 ảnh PNG + `_verification_report.json`, không commit) | `npx tsc --noEmit` exit 0; `eslint` 0 lỗi / 0 cảnh báo; `npm run build` exit 0 (22/22 static routes; lần đầu dừng 1 lần do cảnh báo bảo mật `SecurityFatalError` của Next 16.4.3, chạy lại đạt exit 0); Chrome Headless: `capturedShots: 30`, `overflowCount: 0`, `consoleErrorPages: 0`. |

### Bảng đối chiếu từng trang với đặc tả (`KMA_DAC_TA_GIAO_DIEN.md`)

| Trang | Tình trạng | Ghi chú chi tiết (ĐÃ CÓ / THIẾU / LỆCH) |
|---|---|---|
| A1 Tổng quan (`/dashboard`) | ĐÃ CÓ | Đúng banner gọn (238px), 4 KPI bấm được (GPA 3.48 + sparkline, 107/150, vòng 71%, 5 môn) có đếm số, Hôm nay & buổi học tiếp theo (nhãn "Sắp diễn ra"), 3 tin mới, 3 thẻ lối tắt (Tính GPA, Thư viện, Battle Royale). Đã bỏ khối "5 tiện ích" và banner đỏ cuối trang vốn lệch đặc tả A1. |
| A2 Tin tức (`/dashboard/news`) | ĐÃ CÓ | Page header gọn (130px) + ô tìm kiếm, 5 chip loại tin, tin ghim ảnh trái, lưới 2 cột thẻ tin gọn, cột phải "Đã lưu" + "Chưa đọc", chuông hiện số chưa đọc (4), `?demo=loading\|empty\|error`, đã bỏ nút công tắc demo khỏi UI. |
| A3 Lịch học (`/dashboard/schedule`) | ĐÃ CÓ (lệch nhẹ) | Page header gọn, dải thông báo nghỉ/dạy bù, Tuần/Ngày, Tuần trước/Hôm nay/Tuần sau, màu theo loại, lịch lớp có khóa chỉ xem, lịch cá nhân thêm/sửa/xóa/lặp tuần, cảnh báo trùng giờ, Lịch sắp tới, `?demo=`. Lệch nhẹ: giữ lưới T2–T6 × 5 ca theo dữ liệu mock hiện có (thay vì T2–T7 × 12 tiết) và form thêm/sửa đặt cột phải thay vì ngăn kéo trượt. |
| A4 Học tập (`/dashboard/study`) | ĐÃ CÓ | Page header gọn (130px), 3 thẻ lớn (Tính GPA 3.48 + sparkline, Chương trình học vòng 71%, Thư viện 5.428+), card Môn đang học 5 môn + thanh tiến độ. |
| A5 Tính GPA (`/dashboard/gpa`) | ĐÃ CÓ | Page header gọn (130px), bảng nhập môn quy đổi tức thì hệ 10→chữ→hệ 4, card kết quả sticky phải, GPA mục tiêu có cảnh báo vượt 4.00, biểu đồ đường GPA theo kỳ vẽ dần, nút Khôi phục điểm mẫu, `?demo=`. Tab Học tập sáng đúng. |
| A6 Chương trình học (`/dashboard/curriculum`) | ĐÃ CÓ | Page header gọn (130px) + tìm môn, thanh tiến độ tổng theo tín chỉ, tab lọc học kỳ + chip trạng thái, `?demo=`. Tab Học tập sáng đúng. (Dữ liệu mock hiện có 6 kỳ thay vì 8 kỳ, không đổi mock theo luật). |
| A7 Thư viện (`/dashboard/library`) | ĐÃ CÓ | Page header gọn kèm 3 số liệu nhỏ, banner Tài liệu nổi bật mảnh (≤120px), thanh lọc dính khi cuộn (tìm, Môn, Loại, Sắp xếp, Yêu thích), lưới thẻ tài liệu, form đóng góp tài liệu (chờ duyệt), `?demo=`. Tab Học tập sáng đúng. |
| A8 Hồ sơ (`/dashboard/profile`) | ĐÃ CÓ | Page header gọn (130px), thông tin SV (mã/ngành/lớp chỉ đọc), đổi mật khẩu, liên kết Google (UI), toast thông báo. |
| B1 Admin tổng quan (`/admin`) | ĐÃ CÓ | 4 KPI đếm số (4.826; +342; 128; 5.428), biểu đồ cột+đường 6 tháng vẽ dần, donut khối ngành vẽ dần hiện số thật `5.428 tài liệu` (đã bỏ `100%` cứng), card Cần xử lý (14 tài liệu chờ duyệt, 1 tin đang ẩn) + link tắt. |
| B2 Tin tức & nguồn (`/admin/news`) | ĐÃ CÓ | Bảng tin (nguồn, thời gian, dropdown loại, bật/tắt hiển thị, ghim), cột phải cấu hình nguồn + Kéo tin ngay + Thêm nguồn, `?demo=`. |
| B3 Lịch học chung (`/admin/schedule`) | ĐÃ CÓ (lệch nhẹ) | 4 tab lớp (AT18C, AT19A, CT06B, DT05A), dải ghi chú nghiệp vụ, bảng buổi học, form thêm/sửa + chọn file CSV (UI), khung soạn thông báo nghỉ/dạy bù, `?demo=`. Lệch nhẹ: nút chọn CSV chưa có bước xem trước dòng CSV trước khi xác nhận; form đặt bên dưới bảng thay vì ngăn kéo. |
| B4 Người dùng (`/admin/users`) | ĐÃ CÓ (thiếu nhẹ) | Tìm kiếm, lọc vai trò + lọc trạng thái (mới thêm), đổi vai trò, khóa/mở tài khoản, `?demo=`. Thiếu nhẹ: chưa có thanh phân trang (dữ liệu mock chỉ có 7 bản ghi). |
| B5 Môn học & CTĐT (`/admin/courses`) | ĐÃ CÓ (lệch nhẹ) | Lọc ngành, bảng môn + form thêm/sửa/xóa, `?demo=`. Lệch nhẹ: chưa có lọc theo kỳ và form đặt cột phải thay vì ngăn kéo. |
| B6 Thư viện (`/admin/library`) | ĐÃ CÓ (lệch nhẹ) | Tab trạng thái có số đếm (Tất cả, Chờ duyệt, Đã duyệt), form Tải lên tài liệu, duyệt/xóa, `?demo=`. Lệch nhẹ: chưa tách riêng nút Từ chối bên cạnh nút Xóa và form tải lên mở inline thay vì ngăn kéo. |
| B7 Thang điểm (`/admin/grading`) | ĐÃ CÓ | Thêm bậc, Khôi phục chuẩn KMA, Lưu, bảng chỉnh trực tiếp điểm chữ/thang 10/thang 4/xếp loại, có cảnh báo khi khoảng điểm chồng lấn hoặc có lỗ hổng, `?demo=`. |

## CHƯA LÀM / KHÔNG LÀM ĐƯỢC
- Chưa đo tự động tỷ lệ tương phản pixel trên 100% phần tử sau lần đổi font Lora (chỉ kiểm mắt qua ảnh chụp & giữ nguyên bảng màu đã đạt WCAG AA ở vòng trước) — trạng thái: **chưa kiểm** đo công cụ tự động mới sau khi đổi Lora.
- Chưa kiểm tương tác bàn phím toàn trình (Tab order + focus trap trong drawer mobile/dropdown) trên trình duyệt thật — trạng thái: **chưa kiểm**.
- Chưa chạy kiểm tra trực tiếp trên `npm run dev -- -p 5301` do dùng `next start -p 5301` (bản production build) để chụp ảnh và tránh xung đột khóa `.next/dev` nếu có dev server đang chạy sẵn; cả hai đều dùng cùng bundle Next 16.4.3.
- Chưa chạm `01_backend/` (có 3 file chưa commit sẵn từ trước: `01_backend/package.json`, `01_backend/package-lock.json`, `01_backend/node_modules/.package-lock.json`) và chưa chạm `components/home/home.css` (còn 8 dòng `backdrop-filter` ở trang Home ngoài phạm vi) theo đúng luật.

## LỖI MỚI
| mã | mức | tài khoản + URL | bước tái hiện | mong đợi vs thực tế |
|---|---|---|---|---|
| Không | — | — | — | Đã sửa luôn lỗi chồng chữ header admin ở 375px ngay trong commit `e047015` (xác nhận sạch qua `B1_admin_375.png`). Lưu ý môi trường: `next@16.4.3` có khuyến nghị nâng cấp bảo mật từ CLI (`next upgrade --agent=security`), chưa nâng cấp vì luật cấm sửa `package.json`. |

## CẦN ĐẦU NÃO QUYẾT
1. **Khung giờ lịch học (A3) & nghiệp vụ nhập lịch (B3):** Đặc tả A3 ghi lưới T2–T7 × 12 tiết, còn dữ liệu mock hiện tại đang là T2–T6 × 5 ca (theo chốt trước đó). Đề xuất giữ nguyên T2–T6 × 5 ca đến khi chốt dữ liệu thật từ backend, hoặc nếu muốn đổi thành T2–T7 × 12 tiết thì mở một việc nhỏ bổ sung mock.
2. **Form inline vs Ngăn kéo trượt (Drawer) cho A3, B3, B5, B6 & phân trang B4:** Hiện các form đặt inline cạnh/dưới bảng để dễ xem khi chấm bài tập lớn. Đề xuất giữ nguyên hoặc nếu muốn chuyển sang ngăn kéo trượt + thêm xem trước CSV (B3) + phân trang (B4) thì gộp vào đợt hoàn thiện `KMA-UI-2`.
3. **Nâng cấp `next@16.4.3` theo cảnh báo bảo mật:** Đề xuất tách sang một nhánh bảo trì riêng (ngoài `ui/kma-ui-1`) vì nhiệm vụ này cấm sửa `package.json`.

## ĐỀ XUẤT BƯỚC SAU
1. Anh duyệt 30 ảnh tại `D:/Project-PTUD-web/_shots/` và test nhanh `?demo=loading`, `?demo=empty`, `?demo=error` cùng hiệu ứng pill trượt 800ms khi chuyển tab.
2. Chốt 3 điểm ở mục **CẦN ĐẦU NÃO QUYẾT** rồi merge `ui/kma-ui-1` vào nhánh chính của UI nếu đã ưng ý.
3. Gắn API thật từ `01_backend/` thay cho `lib/mock/dashboard.ts` và `lib/mock/admin.ts` ở giai đoạn tích hợp.
