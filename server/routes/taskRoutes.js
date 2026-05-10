import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getTasks).post(protect, authorize("admin"), createTask);
router.route("/:id").put(protect, updateTask).delete(protect, authorize("admin"), deleteTask);

export default router;
