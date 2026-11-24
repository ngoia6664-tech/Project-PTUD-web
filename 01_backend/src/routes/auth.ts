import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool";
import { ppid } from "node:process";
const router = Router();
function Kiemtra(obj: Record<string, any>) {
  //Record <K,T> định nghĩa cho 1 obj , K là string , T là any (any thuộc tất cả kiểu dữ liệu)
  // duyệt các property trong obj kiểm tra , sai 1 property dừng lại trả false luôn nếu đúng thì chạy tiếp , đúng hết trả true
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== "string" || value.trim() === "") {
      return false;
    }
  }
  return true;
}
router.post("/register", async (req, res) => {
  //Bước 1 kiểm tra điều kiện
  const {
    student_code,
    full_name,
    email,
    password,
    major,
    class_name,
    admission_year,
  } = req.body ?? {};
  const auth_user_check = {
    student_code,
    full_name,
    password,
    email,
    major,
    class_name,
  };
  if (Kiemtra(auth_user_check) === false) {
    res.status(400).json({
      loi: "dữ liệu nhập vào không hợp lệ , không được để trống hoặc kiểu dữ liệu sai",
    });
    return;
  }
  if (!Number.isInteger(admission_year)) {
    res.status(400).json({ loi: "Năm nhập bị sai dữ liệu" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ loi: "Mật khẩu phải trên 6 kí tự" });
    return;
  }
  //Bước 2Băm mật khẩu
  const password_hash = await bcrypt.hash(password, 10);
  // bước 3 gửi Tạo sql
  try {
    const kq = await pool.query(
      /*sql */ `
            insert into users(student_code,full_name,email,password_hash,major,class_name,admission_year) values 
            ($1,$2,$3,$4,$5,$6,$7) RETURNING id, student_code, email
            `,
      [
        student_code,
        full_name,
        email,
        password_hash,
        major,
        class_name,
        admission_year,
      ],
    );
    console.log(kq.rowCount);
    res.status(201).json({ message: "Tạo user thành công", user: kq.rows[0] });
  } catch (err: any) {
    console.error("Lỗi DATABASE" + err)
    if (err.code === "23503" || err.code === "23514") {
      res
        .status(409)
        .json({ loi: "Dữ liệu điền bị trùng trong cột hoặc điền sai phạm vi" });
      return;
    }
    res.status(500).json({ loi: "Lỗi Server" });
  }
});
export default router;
