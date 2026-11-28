import { pool } from "../db/pool";
import type { DongCoTin } from "../utils/tachBangDiem";
export async function saveSnapShot(userId: number, snapShot: DongCoTin[]) {
  try {
    const kq = await pool.query(
      /*sql */ `
              insert into gpa_snapshots (user_id,courses,updated_at) values ($1, $2::jsonb , now()) on conflict (user_id) --on conflict là nếu có thì ghi đè còn không thì tự tạo 1 dòng mới
              do update set 
              courses = excluded.courses, updated_at = now() 
              RETURNING *;
              `,
      [userId, JSON.stringify(snapShot)],
    );
    return kq.rows[0];
  } catch (error: any) {
    throw error;
  }
}
export async function getSnapshots(userId: number) {
  try {
    const kq = await pool.query(
      /*sql */ `
              select courses from gpa_snapshots where user_id=($1);
              `,
      [userId],
    );
    const courses = kq.rows[0]?.courses ?? null;
    return courses;
  } catch (error) {
    throw error;
  }
}
