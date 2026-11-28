import { Router } from "express";
import { TinhGPA, PhanTichBangDiem } from "../controllers/gradeControllers";
import { xacThuc } from "../middleware/VerifyControllers";
const router = Router();
router.post("/parse", xacThuc, PhanTichBangDiem);
router.post("/gpa", xacThuc, TinhGPA);
export default router;
