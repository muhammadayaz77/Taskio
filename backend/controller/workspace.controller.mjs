import Workspace from "../models/workspace.model.mjs";
import Project from '../models/projects.model.mjs'


export const createWorkspace = async (req, res) => {
  try {
    const { 
      name,
      descrption,
      color
     } = req.body;

    const workspace = await Workspace.create({
      name,
      descrption,
      color,
      owner:req.user._id,
      members : [
        {
          user : req.user._id,
          role : 'owner',
          joinedAt : new Date()
        }
      ]
    })
    

   

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace
    });
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getWorkspace = async (req, res) => {
  try {
   const workSpaces = await Workspace.find({
    'members.user' : req.user._id,
   }).sort({
    createdAt : -1
   })
   res.status(200).json(workSpaces);
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getWorkspaceDetails = async (req, res) => {
  try {
    const {workspaceId} = req.params;
   const workSpace = await Workspace.findOne({
    _id : workspaceId,
    "members.user" : req.user._id,
   }).populate("members.user","name email profilePicture")
   if(!workSpace){
     return res.status(404).json({
    message : "Workspace not found",
    success : false
   });
   }
   res.status(200).json(workSpace);
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getWorkspaceProjects = async (req, res) => {
  try {
    const {workspaceId} = req.params;
   const workSpace = await Workspace.findOne({
    _id : workspaceId,
    "members.user" : req.user._id,
   }).populate("members.user","name email profilePicture")
   if(!workSpace){
     return res.status(404).json({
    message : "Workspace not found",
    success : false
   });
   }
   const project = await Project.find({
    workspace : workspaceId,
    isArchived : false,
    members : {$in : [req.user._id]}
   })
   .populate("tasks","status")
   .sort({createdAt : -1})
   res.status(200).json({project,workSpace});
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};