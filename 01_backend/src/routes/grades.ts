import { Router } from "express";
import {
  TinhGPA,
  PhanTichBangDiem,
  saveSnapShotControllers,
  getSnapShotControllers,
} from "../controllers/gradeControllers";
import { xacThuc } from "../middleware/VerifyControllers";
const router = Router();
router.post("/parse", xacThuc, PhanTichBangDiem);
router.post("/gpa", xacThuc, TinhGPA);
router.put("/saveSnapShot", xacThuc, saveSnapShotControllers);
router.get("/getSnapShot", xacThuc, getSnapShotControllers);
export default router;
