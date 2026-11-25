import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { timUserTheoEmail } from "../queries/userQueries";
import { log } from "console";
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
  // if (res.locals.length === 0) {
  //   res
  //     .status(401)
  //     .json({ message: "Xác thực thất bại , token sai", ok: false });
  // }
  // if thừa vì nếu 401 thì đã dừng lại ở Xacthuc , vậy chỉ cần res.status(200) nếu hàm me chạy thì chứng tỏ các điều kiện chắc chắn đúng
  // console.log("USERRRRRRR :" + res.locals.user);
  res
    .status(200)
    .json({ message: "Xác thực thành công ", ok: true, user: res.locals.user });
}
