import express from "express";
import {
  deleteMember,
  getUsers,
  toggleMemberBlockStatus,
  updateProfile,
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);
router.put("/profile", protect, updateProfile);
router.patch("/:id/block", protect, authorize("admin"), toggleMemberBlockStatus);
router.delete("/:id", protect, authorize("admin"), deleteMember);

export default router;
