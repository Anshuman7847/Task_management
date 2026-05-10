import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const normalizeMembers = (members = []) => [...new Set(members.map(String))];

export const createProject = async (req, res) => {
  const { title, description, members = [] } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Project title is required" });
  }

  const validMembers = await User.find({ _id: { $in: members } }).select("_id");
  const memberIds = normalizeMembers([...validMembers.map((user) => user._id), req.user._id]);

  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id,
    members: memberIds,
  });

  const populatedProject = await project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" },
  ]);

  res.status(201).json(populatedProject);
};

export const getProjects = async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : {
          $or: [{ members: req.user._id }, { createdBy: req.user._id }],
        };

  const projects = await Project.find(filter)
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  res.json(projects);
};

export const updateProject = async (req, res) => {
  const { title, description, members = [] } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const validMembers = await User.find({ _id: { $in: members } }).select("_id");
  project.title = title || project.title;
  project.description = description ?? project.description;
  project.members = normalizeMembers([...validMembers.map((user) => user._id), project.createdBy]);

  await project.save();

  const populatedProject = await project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" },
  ]);

  res.json(populatedProject);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ message: "Project deleted successfully" });
};
