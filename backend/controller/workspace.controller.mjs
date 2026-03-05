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
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        success: false,
      });
    }

    // check membership
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
        success: false,
      });
    }

    // get projects + tasks
    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate archieved priority updatedAt project"
        )
        .sort({ createdAt: -1 }),
    ]);

    // total tasks
    const totalTasks = projects.reduce(
      (acc, project) => acc + project.tasks.length,
      0
    );

    // project stats
    const totalProjectProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;

    const totalProjectCompleted = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    // task stats
    const totalTaskCompleted = projects.reduce(
      (acc, project) =>
        acc + project.tasks.filter((task) => task.status === "Done").length,
      0
    );

    const totalTaskTodo = projects.reduce(
      (acc, project) =>
        acc + project.tasks.filter((task) => task.status === "To Do").length,
      0
    );

    const totalTaskInProgress = projects.reduce(
      (acc, project) =>
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length,
      0
    );

    const tasks = projects.flatMap((project) => project.tasks);

    // upcoming tasks (next 7 days)

    const today = new Date();

    const upcomingTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;

      const taskDate = new Date(task.dueDate);

      return (
        taskDate > today &&
        taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    // task trends chart

    const taskTrendsData = [
      { name: "Sun", completed: 0, InProgress: 0, Todo: 0 },
      { name: "Mon", completed: 0, InProgress: 0, Todo: 0 },
      { name: "Tue", completed: 0, InProgress: 0, Todo: 0 },
      { name: "Wed", completed: 0, InProgress: 0, Todo: 0 },
      { name: "Thu", completed: 0, InProgress: 0, Todo: 0 },
      { name: "Fri", completed: 0, InProgress: 0, Todo: 0 },
      { name: "Sat", completed: 0, InProgress: 0, Todo: 0 },
    ];

    // last 7 days

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // populate trends

    for (const project of projects) {
      for (const task of project.tasks) {
        if (!task.updatedAt) continue;

        const taskDate = new Date(task.updatedAt);

        const dayIndex = last7Days.findIndex(
          (date) =>
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear()
        );

        if (dayIndex !== -1) {
          const dayName = last7Days[dayIndex].toLocaleDateString("en-US", {
            weekday: "short",
          });

          const dayData = taskTrendsData.find((day) => day.name === dayName);

          if (dayData) {
            switch (task.status) {
              case "Done":
                dayData.completed++;
                break;

              case "In Progress":
                dayData.InProgress++;
                break;

              case "To Do":
                dayData.Todo++;
                break;
            }
          }
        }
      }
    }

    // project status distribution

    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value++;
          break;

        case "In Progress":
          projectStatusData[1].value++;
          break;

        case "Planning":
          projectStatusData[2].value++;
          break;
      }
    }

    // task priority distribution

    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const task of tasks) {
      switch (task.priority) {
        case "High":
          taskPriorityData[0].value++;
          break;

        case "Medium":
          taskPriorityData[1].value++;
          break;

        case "Low":
          taskPriorityData[2].value++;
          break;
      }
    }

    // workspace productivity

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTasks = project.tasks;

      const completedTask = projectTasks.filter(
        (task) => task.status === "Done" && task.archieved === false
      );

      workspaceProductivityData.push({
        name: project.title,
        completed: completedTask.length,
        total: projectTasks.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectProgress,
      totalProjectCompleted,
      totalTaskCompleted,
      totalTaskTodo,
      totalTaskInProgress,
    };

    res.status(200).json({
      stats,
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (err) {
    console.log("Error :", err);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};