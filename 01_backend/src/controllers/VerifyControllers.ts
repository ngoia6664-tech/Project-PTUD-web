import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function xacThuc(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "header sai định dạng hoặc không tồn tại", ok: false });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      // kiểm tra token nếu sai ném lỗi và ngay lập tức xuống catch
      id: number;
      role: string;
    };
    res.locals.user = payload;
  } catch (error: any) {
    console.error("[CATCH báo lỗi :]", error);
    if (error.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ message: "Phiên đăng nhập đã hết hạn", ok: false });
      return;
    }
    res.status(401).json({ message: "Phiên đăng nhập không đúng", ok: false });
    return; // dừng lại nếu trả 401, me không bao giờ được gọi
  }
  next();
}
