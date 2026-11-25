import { pool } from "../db/pool";

export async function timUserTheoEmail(email: string) {
  const kq = await pool.query(
    /* sql */ `SELECT id, email, password_hash, status, role FROM users WHERE email = $1`,
    [email],
  );
  return kq.rows[0]; // không có user thì trả về undefined
}
