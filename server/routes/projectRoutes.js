import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getProjects).post(protect, authorize("admin"), createProject);
router
  .route("/:id")
  .put(protect, authorize("admin"), updateProject)
  .delete(protect, authorize("admin"), deleteProject);

export default router;
