import type { Request, Response } from "express";
import { DongCoTin, tinhGPA, xuLyBangDiem } from "../utils/tachBangDiem";
// xử lí bảng điểm của các môn cho hợp lệ trước
export function PhanTichBangDiem(req: Request, res: Response) {
  const { text } = req.body ?? {};
  if (typeof text !== "string" || text.trim() === "" || text.length > 50000) {
    res
      .status(400)
      .json({ message: "Chuỗi truyền vào không hợp lệ", ok: false });
    return;
  }
  const courses = xuLyBangDiem(text); // courses là khóa học hoặc dịch ra là môn học;

  if (courses.length === 0) {
    res
      .status(400)
      .json({ message: "Không có đọc được môn nào từ chuỗi", ok: false }); // em không biết nên để ok true hay false;
    return;
  }
  res
    .status(200)
    .json({ message: "đọc bảng thành công", ok: true, courses: courses });
}
// Sau đó dựa vào bảng điểm đã xử lí mới yêu cầu bắt đầu tính GPA
export function TinhGPA(req: Request, res: Response) {
  const { courses } = req.body ?? {};
  if (!Array.isArray(courses)) {
    res
      .status(400)
      .json({ message: "Mảng truyền vào không hợp lệ", ok: false });
    return;
  }
  if (courses.length === 0) {
    res
      .status(400)
      .json({ message: "Không có môn học nào trong danh sách", ok: false });
    return;
  }
  if (courses.length > 100) {
    res
      .status(400)
      .json({ message: "Mảng truyền vào không quá 100 phần tử", ok: false });
    return;
  }
  for (const x of courses) {
    const tinChi = x.tinChi;
    if (!Number.isInteger(tinChi) || tinChi < 1 || tinChi > 10) {
      res.status(400).json({
        message: "tín chỉ không hợp lệ",
        ok: false,
      });
      return;
    }
  }
  try {
    const GPA = tinhGPA(courses as DongCoTin[]);
    res
      .status(200)
      .json({ message: "Tính GPA thành công", GPA: GPA, ok: true });
  } catch (error: any) {
    console.log("[CATCH] báo lỗi :" + error.message);
    res.status(400).json({ message: "Tính GPA không thành công", ok: false });
  }
}
