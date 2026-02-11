import Project from "../models/projects.model.mjs";
import Task from "../models/task.model.mjs";
import Workspace from "../models/workspace.model.mjs";


export const createProject = async (req, res) => {
  try {
    const {workspaceId} = req.params;
    const { 
      title,
      description,
      status,
      startDate,
      dueDate,
      tags,
      members 
     } = req.body;

     const workspace = await Workspace.findById(workspaceId)
    
     if(!workspace){
      return res.status(404).json({
      message: "Workspace not found",
      success : false
    });
     }

     const isMember = workspace.members.some((member) => member.user.toString() === req.user._id.toString())

     if(!isMember){
      return res.status(404).json({
      message: "You are not a member of this workspace",
      success : false
    });
     }
   

     const tagsArray = tags ? tags.split(',') : []

     const newProject = await Project.create({
      title,
      description,
      workspace : workspaceId,
      status,
      startDate,
      dueDate,
      tags : tagsArray,
      members,
      createdBy:req.user._id
     })

     workspace.projects.push(newProject._id);
     await workspace.save()
    return res.status(201).json({
      message: "Project created successfully",
      newProject
    });
  
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getProjectDetails = async (req, res) => {
  try {
    const {projectId} = req.params;

     const project = await Workspace.findById(projectId)
    
     if(!project){
      return res.status(404).json({
      message: "Project not found",
      success : false
    });
     }

     const isMember = project.members.some((member) => member.user.toString() === req.user._id.toString())

     if(!isMember){
      return res.status(404).json({
      message: "You are not a member of this workspace",
      success : false
    });
     }
   

    return res.status(200).json({
      message: "Project get successfully",
      project
    });
  
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getProjectTasks = async (req, res) => {
  try {
    const {projectId} = req.params;

     const project = await Project.findById(projectId).populate('members.user')

     if(!project){
      return res.status(404).json({
      message: "Project not found",
      success : false
    });
     }

     console.log("req.user._id : ",req.user._id)
     console.log("project : ",project.members)


     const isMember = project.members.some((member) => member.user?._id.toString() === req.user._id.toString())
     if(!isMember){
      return res.status(404).json({
      message: "You are not a member of this workspace",
      success : false
    });
     }

     const tasks = await Task.find({
      project : projectId,
      isArchieved : false
     })
     .populate("assignees","name profilePicture")
     .sort({createdAt : -1})

    return res.status(200).json({
      message: "Task and Project get successfully",
      project,
      tasks 
    });
  
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};