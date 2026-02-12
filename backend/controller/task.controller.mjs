


export const createTask = async (req, res) => {
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