import Workspace from "../models/workspace.model.mjs";
import Project from '../models/projects.model.mjs'


export const createWorkspace = async (req, res) => {
  try {
    const { 
      name,
      description,
      color
     } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
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
    console.log('working... ')
    const {workspaceId} = req.params;
    console.log('workspace id : ',workspaceId)
   const workSpace = await Workspace.findOne({
    _id : workspaceId,
    "members.user" : req.user._id,
   }).populate("members.user","name email profilePicture")
   console.log('workspace : ',workSpace)
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
   const workspace = await Workspace.findOne({
    _id : workspaceId,
    "members.user" : req.user._id,
   }).populate("members.user","name email profilePicture");

   if(!workspace){
     return res.status(404).json({
    message : "Workspace not found",
    success : false
   });
   }
   const project = await Project.find({
    workspace : workspaceId,
    isArchived : false,
    // members : {$in : [req.user._id]}
   })
  //  .populate("tasks","status")
   .sort({createdAt : -1})
   res.status(200).json({project,workspace});
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const getWorkspaceStats = async (req, res) => {
  try {
    const {workspaceId} = req.params;
   const workspace = await Workspace.findById(workspaceId)
   console.log(workspace);  
   if(!workspace){
     return res.status(404).json({
    message : "Workspace not found",
    success : false
   });
   }
   const project = await Project.findById(task.project);

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
        success: false,
      });
    }

    const [totalProjects,projects] = Promise.all([
      Project.countDocuments({workspace:workspaceId}),
      Project.find({workspace : workspaceId}).populate('task','title status dueDate isArchived priority')
    ]).sort({createdAt : -1})

    const totalTasks = projects.reduce((acc,project) => {
      return acc + project.tasks.length
    })

    const totalProjectProgress = projects.filter((project) => project.status == "In Progress");
    const totalProjectCompleted = projects.filter((project) => project.status == "Completed");
    
    const totalTaskCompleted = projects.reduce((acc,project) => {
      return acc + project.tasks.filter((task) => task.status == "Done").length
    },0)
    const totalTaskTodo = projects.reduce((acc,project) => {
      return acc + project.tasks.filter((task) => task.status == "To Do").length
    },0)


   res.status(200).json({project,workspace});
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};