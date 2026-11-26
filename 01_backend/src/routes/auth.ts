import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool";
import { Login, Register } from "../controllers/authControllers";
import { xacThuc } from "../controllers/VerifyControllers";
import { Me } from "../controllers/authControllers";
const router = Router();
function Kiemtra(obj: Record<string, any>) {
  //Record <K,T> định nghĩa cho 1 obj , K là string , T là any (any thuộc tất cả kiểu dữ liệu)
  // duyệt các property trong obj kiểm tra , sai 1 property dừng lại trả false luôn nếu đúng thì chạy tiếp , đúng hết trả true
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== "string" || value.trim() === "") {
      return false;
    }
  }
  return true;
}
router.post("/register", Register);
router.post("/login", Login);
router.get("/me", xacThuc, Me);
export default router;
