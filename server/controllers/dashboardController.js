import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  const projectFilter =
    req.user.role === "admin"
      ? {}
      : {
          $or: [{ members: req.user._id }, { createdBy: req.user._id }],
        };

  const taskFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const now = new Date();

  const [projects, tasks, completedTasks, pendingTasks, overdueTasks, recentTasks] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "completed" }),
    Task.countDocuments({ ...taskFilter, status: { $ne: "completed" } }),
    Task.countDocuments({ ...taskFilter, status: { $ne: "completed" }, dueDate: { $lt: now } }),
    Task.find(taskFilter)
      .populate("assignedTo", "name")
      .populate("project", "title")
      .sort({ updatedAt: -1 })
      .limit(5),
  ]);

  res.json({
    totalProjects: projects,
    totalTasks: tasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    recentTasks,
  });
};
