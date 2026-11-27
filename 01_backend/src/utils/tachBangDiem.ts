export type Dong = {
  namHoc: string;
  hocKy: number;
  mon: string;
  lan: number;
  diemThi: number | null;
  diemHP: number | null;
  diemChu: string;
};

function soHoacNull(s: string): number | null {
  return s.trim() === "" ? null : Number(s);
}

export function tachDong(text: string): Dong[] {
  const ketQua: Dong[] = [];
  const cacDong = text.split("\n");

  for (const dong of cacDong) {
    const cot = dong.split("\t");

    // Bỏ dòng rác: quá ít ô, hoặc ô đầu không phải số thứ tự
    if (cot.length < 9) continue;
    if (cot[0].trim() === "" || !Number.isInteger(Number(cot[0]))) continue;

    // Lấy ô theo vị trí (bỏ qua: STT, "Lựa chọn", TP1, TP2, ĐQT)
    const [
      ,
      ,
      namHoc,
      hocKy,
      mon,
      lan,
      ,
      ,
      ,
      diemThi = "",
      diemHP = "",
      diemChu = "",
    ] = cot;

    ketQua.push({
      namHoc: namHoc.trim(),
      hocKy: Number(hocKy),
      mon: mon.trim(),
      lan: Number(lan),
      diemThi: soHoacNull(diemThi),
      diemHP: soHoacNull(diemHP),
      diemChu: diemChu.trim(),
    });
  }
  return ketQua;
}
export function locMonTinhGPA(dongs: Dong[]): Dong[] {
  // em viết: giữ lại dòng thỏa CẢ HAI điều kiện
  const MonTinhGPA = dongs.filter(
    (x) => x.diemThi !== null && !x.mon.startsWith("Giáo dục thể chất"),
  );
  return MonTinhGPA;
  //   1. diemThi khác null
  //   2. mon KHÔNG bắt đầu bằng "Giáo dục thể chất"
}
export function gopHocLai(dongs: Dong[]) {
  const latestByCourse = new Map<string, Dong>();
  for (const d of dongs) {
    const exitsting = latestByCourse.get(d.mon);
    if (!exitsting || d.lan > exitsting.lan) {
      latestByCourse.set(d.mon, d);
    }
  }
  return [...latestByCourse.values()];
}
