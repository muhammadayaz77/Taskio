import Project from "../models/projects.model.mjs";
import Task from "../models/task.model.mjs";
import Workspace from "../models/workspace.model.mjs";
import mongoose from 'mongoose'



export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
    } = req.body;

    console.log("assignees : ",assignees)

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        success: false,
      });
    }

    const isMember = workspace.members.some(
      (member) =>
        member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
        success: false,
      });
    }

    // 🔥 FIX 1 — Convert assignees to ObjectId array
    const formattedAssignees = assignees?.map(a => a.user);

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees: formattedAssignees, // ✅ correct format
      project: projectId,            // ✅ required field added
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();

    return res.status(201).json({
      message: "Task created successfully",
      newTask,
    });

  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};

export const updateTittleName = async (req, res) => {
  try {
    const { taskId } = req.params;

    const {
      title,
      description
    } = req.body;


    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }

    const isMember = project.members.some(
      (member) =>
        member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    task.title = title
    await task.save();

    return res.status(201).json({
      message: "Task updated successfully",
      task,
    });

  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // 1️⃣ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
          success: false,
          message: "Invalid Task ID",
        });
    }

    // 2️⃣ Find Task
    const task = await Task.findById(taskId)
    .populate('assignees')
    .populate('watchers');
    
    console.log("task id ", taskId)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 3️⃣ Find Project using task.project
    const project = await Project.findById(task.project)
    .populate('members.user');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 4️⃣ Send Response
    return res.status(200).json({
      success: true,
      task,
      project,
    });

  } catch (error) {
    console.error("Error in getTaskWithProject:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};