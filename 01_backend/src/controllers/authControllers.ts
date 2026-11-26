import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateUser, timUserTheoEmail } from "../queries/userQueries";
import { log } from "console";
import { pool } from "../db/pool";
type user = {
  student_code: string;
  full_name: string;
  email: string;
  password: string;
  major: string;
  class_name: string;
  admission_year: number;
};
export async function Login(req: Request, res: Response) {
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
    const user = await timUserTheoEmail(email);

    if (!user) {
      res.status(401).json({ loi: "Email hoặc mật khẩu không chính xác" });
      return;
    }
    // đối chiếu mật khẩu và email với database
    const checkPassWord = await bcrypt.compare(password, user.password_hash);

    if (!checkPassWord) {
      // Bỏ email !== user.rows[0],email vì nếu email không có trong database thì user.rowcount =0 ở bước kiểm tra trước
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
}
export async function Me(req: Request, res: Response) {
  // trả cho client ở hàm Me nếu XacThuc kiểm tra đúng hết
  res
    .status(200)
    .json({ message: "Xác thực thành công ", ok: true, user: res.locals.user });
}
export async function Register(req: Request, res: Response) {
  const {
    student_code,
    full_name,
    email,
    password,
    major,
    class_name,
    admission_year,
  } = req.body ?? {};
  const propertyStringUser = {
    student_code,
    full_name,
    email,
    password,
    major,
    class_name,
  } satisfies Record<string, string>;
  const Kiemtra = (obj: Record<string, any>) => {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value !== "string" || value.trim() === "") {
        return false;
      }
    }
    return true;
  };
  if (!Kiemtra(propertyStringUser) || !Number.isInteger(admission_year)) {
    res.status(400).json({ message: "Dữ liệu nhập không hợp lệ", ok: false });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ loi: "Mật khẩu ít nhất 6 kí tự" });
    return;
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user: user = await CreateUser({
      student_code: student_code,
      full_name: full_name,
      email: email,
      password_hash: password_hash,
      major: major,
      class_name: class_name,
      admission_year: admission_year,
    });
    res
      .status(201)
      .json({ message: "Tạo user thành công", ok: true, user: user });
  } catch (err: any) {
    console.error("Lỗi DATABASE", err.message);
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
}
