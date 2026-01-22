import Workspace from "../models/workspace.model";



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