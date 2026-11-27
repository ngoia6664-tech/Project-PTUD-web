import { pool } from "../db/pool";
type NewUser = {
  student_code: string;
  full_name: string;
  email: string;
  password_hash: string;
  major: string;
  class_name: string;
  admission_year: number;
};
export async function timUserTheoEmail(email: string) {
  const kq = await pool.query(
    /* sql */ `SELECT id, email, password_hash, status, role FROM users WHERE email = $1`,
    [email],
  );
  return kq.rows[0]; // không có user thì trả về undefined
}
export async function CreateUser(u: NewUser) {
  try {
    const kq = await pool.query(
      /*sql */ `
            insert into users(student_code,full_name,email,password_hash,major,class_name,admission_year) values 
            ($1,$2,$3,$4,$5,$6,$7) RETURNING id, student_code, email
            `,
      [
        u.student_code,
        u.full_name,
        u.email,
        u.password_hash,
        u.major,
        u.class_name,
        u.admission_year,
      ],
    );
    return kq.rows[0];
  } catch (err) {
    throw err;
  }
}
