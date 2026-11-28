import type { Request, Response } from "express";
import { DongCoTin, tinhGPA, xuLyBangDiem } from "../utils/tachBangDiem";
import { getSnapshots, saveSnapShot } from "../queries/gradesQueries";
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
export async function saveSnapShotControllers(req: Request, res: Response) {
  const data = req.body ?? {};
  const { courses } = data ?? {};
  const user_id = res.locals.user.id;
  // courses không phải mảng
  if (!Array.isArray(courses)) {
    res
      .status(400)
      .json({ message: "Dữ liệu truyền vào không phải mảng", ok: false });
    return;
  }
  //courses .length = 0 và 100
  if (courses.length === 0 || courses.length > 100) {
    res.status(400).json({
      message: "Mảng truyền vào có kích thước không hợp lệ",
      ok: false,
    });
    return;
  }
  for (const dong of courses) {
    // mỗi phần tử phải là object thật (không phải null, số, chuỗi hay mảng)
    if (typeof dong !== "object" || dong === null || Array.isArray(dong)) {
      res.status(400).json({
        message: "phần tử trong mảng không phải là Object",
        ok: false,
      });
      return;
    }
    if (!Number.isInteger(dong.tinChi) || dong.tinChi < 1 || dong.tinChi > 10) {
      res
        .status(400)
        .json({ message: "Mảng có tín chỉ không hợp lệ", ok: false });
      return;
    }
  }
  try {
    await saveSnapShot(user_id as number, courses as DongCoTin[]);
    res
      .status(200)
      .json({ message: "Lưu môn lên server thành công", ok: true });
  } catch (error: any) {
    console.log("CATCH Controller bắt lỗi:" + error.message);
    res.status(500).json({ message: "Lỗi server", ok: false });
  }
  //courses có tín chỉ <1 > 10
}
export async function getSnapShotControllers(req: Request, res: Response) {
  const user_id = res.locals.user.id;
  try {
    const kq = await getSnapshots(user_id);
    res.status(200).json({
      message: "Lấy kết quả thành công",
      ok: true,
      courses: kq ?? [], // chưa lưu gì thì trả mảng rỗng, không phải lỗi
    });
  } catch (error: any) {
    console.log("CATCH Controller bắt lỗi:" + error.message);
    res.status(500).json({ message: "Lỗi server", ok: false });
  }
}
