import Project from "../models/projects.model.mjs";
import Task from "../models/task.model.mjs";
import Workspace from "../models/workspace.model.mjs";



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
