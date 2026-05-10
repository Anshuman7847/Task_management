import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const populateTask = [
  { path: "assignedTo", select: "name email role" },
  { path: "project", select: "title description" },
];

export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, project } = req.body;

  if (!title || !dueDate || !assignedTo || !project) {
    return res.status(400).json({ message: "Title, due date, project, and assignee are required" });
  }

  const [existingProject, assignee] = await Promise.all([
    Project.findById(project),
    User.findById(assignedTo),
  ]);

  if (!existingProject) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!assignee) {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    project,
  });

  const populatedTask = await task.populate(populateTask);
  res.status(201).json(populatedTask);
};

export const getTasks = async (req, res) => {
  const { status, project, assignedTo } = req.query;
  const filter = {};

  if (req.user.role === "member") {
    filter.assignedTo = req.user._id;
  }

  if (status) {
    filter.status = status;
  }

  if (project) {
    filter.project = project;
  }

  if (assignedTo && req.user.role === "admin") {
    filter.assignedTo = assignedTo;
  }

  const tasks = await Task.find(filter).populate(populateTask).sort({ dueDate: 1, createdAt: -1 });

  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (req.user.role === "member") {
    const isOwner = String(task.assignedTo) === String(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    task.status = req.body.status || task.status;
    await task.save();
    const populatedMemberTask = await task.populate(populateTask);
    return res.json(populatedMemberTask);
  }

  const { title, description, status, priority, dueDate, assignedTo, project } = req.body;

  if (assignedTo) {
    const assignee = await User.findById(assignedTo);
    if (!assignee) {
      return res.status(404).json({ message: "Assigned user not found" });
    }
  }

  if (project) {
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }
  }

  task.title = title || task.title;
  task.description = description ?? task.description;
  task.status = status || task.status;
  task.priority = priority || task.priority;
  task.dueDate = dueDate || task.dueDate;
  task.assignedTo = assignedTo || task.assignedTo;
  task.project = project || task.project;

  await task.save();

  const populatedTask = await task.populate(populateTask);
  res.json(populatedTask);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
};
