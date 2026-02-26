import { recordActivity } from "../libs/index.mjs";
import activityLog from "../models/activity.mjs";
import Comment from "../models/comment.model.mjs";
import Project from "../models/projects.model.mjs";
import Task from "../models/task.model.mjs";
import Workspace from "../models/workspace.model.mjs";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    console.log("assignees : ", assignees);

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
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
        success: false,
      });
    }

    // 🔥 FIX 1 — Convert assignees to ObjectId array
    const formattedAssignees = assignees?.map((a) => a.user);

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees: formattedAssignees, // ✅ correct format
      project: projectId, // ✅ required field added
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

    const { title, description } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    const oldTitle = task.title;

    // add activity log

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `Updated task tittle from ${oldTitle} to ${title}`,
    });

    task.title = title;
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
export const updateTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { description } = req.body;

    console.log("init des : ", description);

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }
    console.log("old desc : ", description);
    const oldDescription =
      task.description.substring(0, 50) +
      (description.length > 50 ? "..." : "");
    const newDescription =
      description.substring(0, 50) + (description.length > 50 ? "..." : "");

    // add activity log

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `Updated task description from ${oldDescription} to ${newDescription}`,
    });

    task.description = description;

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
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { status } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    const oldStatus = task.status;

    // add activity log

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `Updated task status from ${oldStatus} to ${status}`,
    });

    task.status = status;

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
export const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { assignees } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    const oldAssignees = task.assignees;

    // add activity log

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `Updated task assignees`,
    });

    task.assignees = assignees;

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
export const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { priority } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    const oldPriority = task.priority;

    // add activity log

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `Updated task priority from ${oldPriority} to ${priority}`,
    });

    task.priority = priority;
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
export const addSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { title } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    const newSubtask = {
      title,
      completed : false
    }

    // add activity log
    
    task.subTasks.push(newSubtask);
    await task.save();
     
        await recordActivity(req.user._id, "created_subtask", "Task", taskId, {
          description: `Created sub-task : ${title}`,
        });

    return res.status(201).json({
      message: "Sub Task created successfully",
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
export const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { completed } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }

    // ✅ Correct way to find subdocument
    const selectedSubTask = task.subTasks.id(subTaskId);

    if (!selectedSubTask) {
      return res.status(404).json({
        message: "SubTask not found",
        success: false,
      });
    }

    // ✅ Update completed field
    selectedSubTask.completed = completed;

    await task.save();

    // ✅ Activity Log
    await recordActivity(req.user._id, "updated_subtask", "Task", taskId, {
      description: `Updated sub-task to ${
        completed ? "Completed" : "Not completed"
      }`,
    });

    return res.status(200).json({
      message: "Sub Task updated successfully",
      success: true,
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
    const task = await Task.findById(taskId).populate("assignees");

    console.log("task assignees : ", task);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // 3️⃣ Find Project using task.project
    const project = await Project.findById(task.project).populate(
      "members.user",
    );

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

export const getTaskActivity = async (req, res) => {
  try {
    const { resourceId } = req.params;

    // 1️⃣ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Rescource ID",
      });
    }

    // 2️⃣ Find Task
    const activity = await activityLog.find({resourceId})
    .populate("user")
    .sort({ createdAt: -1 })
    ;
    console.log('activity : ',activity)

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity Log not found",
      });
    }


    // 4️⃣ Send Response
    return res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    console.error("Error in getTaskWithProject:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { text } = req.body;

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
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
        success: false,
      });
    }
    const newComment = await Comment.create({
      text,
      task :taskId,
      author : req.user._id
    })
    // add activity log

    await recordActivity(req.user._id, "added_comment", "Comment", taskId, {
      description: `Comment Added ${text}`,
    });

    task.comments.push(newComment._id);

    await task.save();

    return res.status(201).json({
      message: "Comment added successfully",
      newComment,
    });
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getCommentsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({
      task: taskId
    })
    .populate('author')
    .sort({createdAt: -1})
    return res.status(200).json({
      comments,
    });
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};