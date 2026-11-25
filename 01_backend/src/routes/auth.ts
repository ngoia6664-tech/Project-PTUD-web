import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool";
import jwt from "jsonwebtoken";
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
    res.status(400).json({ loi: "Mật khẩu ít nhất 6 kí tự" });
    return;
  }
  //Bước 2Băm mật khẩu
  // bước 3 gửi Tạo sql
  try {
    const password_hash = await bcrypt.hash(password, 10);
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
    console.error("Lỗi DATABASE", err);
    if (err.code === "23514") {
      res.status(400).json({
        loi: "Dữ liệu vượt phạm vi cho phép (năm nhập học, ngành, ...)",
      });
      return;
    }
    if (err.code === "23505") {
      res.status(409).json({ loi: "Mã sinh viên hoặc email đã tồn tại" });
      return;
    }
    res.status(500).json({ loi: "Lỗi Server" });
  }
});
router.post("/login", async (req, res) => {
  // Lấy email và password của client gửi qua body
  const { email, password } = req.body ?? {};
  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.trim() === ""
  ) {
    res.status(400).json({ loi: "Thiếu email hoặc mật khẩu" });
    return;
  }
  try {
    // tìm kiếm dựa vào email
    const kq = await pool.query(
      /*sql*/ `
      select id,email,password_hash,status,role from users where email =$1
      `,
      [email],
    );
    const user = kq.rows[0];
    if (kq.rowCount === 0) {
      res.status(401).json({ loi: "Email hoặc mật khẩu không chính xác" });
      return;
    }
    // đối chiếu mật khẩu và email với database
    const checkPassWord = await bcrypt.compare(password, user.password_hash);

    if (!checkPassWord) {
      // Bỏ email !== kq.rows[0],email vì nếu email không có trong database thì kq.rowcount =0 ở bước kiểm tra trước
      res.status(401).json({ loi: "Email hoặc mật khẩu không chính xác" });
      return;
    }
    //Check hết từ email đến mật khẩu sau đó kiểm tra trạng thái tài khoản
    if (user.status === "locked") {
      res.status(403).json({ loi: "Tài khoản đang bị khóa" });
      return;
    }
    //đúng hết thì phát token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );
    res.status(200).json({ message: "Đăng nhập thành công", token: token });
  } catch (error: any) {
    console.error("Lỗi database", error);
    res.status(500).json({ loi: "Lỗi server" });
  }
});
export default router;
