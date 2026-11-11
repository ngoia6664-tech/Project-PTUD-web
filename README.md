# Project-PTUD-web

Đồ án môn Phát triển phần mềm Web (nhóm 3 người). Đề tài: chưa chốt.

## Cấu trúc

- `00_frontend/` : giao diện (Next.js + React + TypeScript + Tailwind), chạy cổng 3000
- `01_backend/`  : server (Node.js + Express + MySQL), chạy cổng 4000
- `01_backend/sql/` : lệnh tạo bảng

## Chạy thử

Frontend:

    cd 00_frontend
    npm install
    npm run dev

Backend: (sẽ bổ sung khi làm xong)

## Quy tắc nhóm

- Không code thẳng trên `main`, mỗi việc một nhánh, gộp bằng Pull Request.
- Không đẩy file `.env` (mật khẩu, khóa bí mật). Dùng `.env.example` làm mẫu.

## Quy ước đặt tên

### Class CSS

Công thức: `tiền-tố-thành-phần`, chữ thường, nối bằng dấu gạch ngang.

| Phần | Quy ước | Ví dụ |
|---|---|---|
| Tiền tố | Tên trang/tính năng chứa nó | `auth-`, `home-`, `dash-` |
| Dùng chung nhiều trang | Tiền tố `ui-` | `ui-btn`, `ui-input` |
| Thành phần con | Nối thêm sau tiền tố | `auth-card`, `auth-card-title` |
| Trạng thái | Bắt đầu bằng `is-` | `is-active`, `is-error` |
| Biến thể | Thêm đuôi `--` | `ui-btn--primary` |

Nên tránh:
1. Đặt tên theo hình dáng (`red-text`, `big`). Đặt theo vai trò (`error-text`).
2. Tên quá chung không có tiền tố (`logo`, `card`, `btn`), sẽ đè lên trang khác.
3. Dùng `id` để định kiểu CSS. `id` chỉ dùng khi bắt buộc (`label htmlFor`, neo trang).
4. Selector quá sâu (tối đa 2 cấp).
5. Tên class và file bằng tiếng Việt. Dùng tiếng Anh, tiếng Việt để trong comment và nội dung hiển thị.

### File và thư mục

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Thư mục trang | Chữ thường, tiếng Anh | `login`, `register`, `dashboard` |
| File component | Viết hoa chữ đầu mỗi từ | `InputField.tsx` |
| File CSS | Tên tính năng, chữ thường, đặt cạnh nơi dùng | `components/auth/auth.css` |
| Biến và hàm | camelCase | `handleSubmit` |
| Kiểu (type) | PascalCase | `RegisterInput` |
