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
      id: number;
      role: string;
    }; // sai token nhưng kết quả vẫn trả về id và student ??? vì vậy !playload không bao giờ xảy ra
    //vì vậy token xác thực sai những dingf dưới vẫn chạy nhưng đáng ra vậy thì phải báo 200 chứ nhỉ? hơi khó hiểu , còn await cuối dù trả về 200 nhưng lại không hiện user
    // => lỗi ở hàm me
    // console.log("playload ở đâyyyy", payload.id + payload.role);
    //code cũ
    // if (!playload) {
    //   res
    //     .status(401)
    //     .json({ message: "Phiên đăng nhập không đúng", ok: false });
    //   return; // em chưa biết next đoạn nào
    // }
    //Code mới
    res.locals.user = payload;
    //dòng ở dưới không chạy ?? vì vậy res.local.user không gắn được playload
    // res
    //   .status(200)
    //   .json({ message: "Xác thực thành công", ok: true, user: playload });
    //  hàm xác thực chỉ đề kiểm tra các lỗi trả về cho client để hàm me làm nếu xác thực đúng
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
