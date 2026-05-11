import Workspace from "../models/workspace.model.mjs";
import Project from '../models/projects.model.mjs'
import Task from "../models/task.model.mjs";
import User from "../models/user.model.mjs";
import jwt from "jsonwebtoken";
import WorkspaceInvite from "../models/workspace.invite.model.mjs";
import Conversation from "../models/conversation.model.mjs";
import Message from "../models/message.model.mjs";
import { sendEmail } from '../libs/send-email.js'


function maskEmail(email) {
  const normalized = String(email || "").trim();
  const [local, domain] = normalized.split("@");
  if (!domain) return "***";
  if (local.length <= 1) return `*@${domain}`;
  const dots = Math.min(Math.max(local.length - 1, 1), 6);
  return `${local[0]}${"\u2022".repeat(dots)}@${domain}`;
}

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function workspaceMemberRole(inviteRole) {
  if (inviteRole === "admin") return "admin";
  if (inviteRole === "viewer") return "viewer";
  return "member";
}

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
   })
   .populate("tasks", "status")
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

/** Archived tasks across all projects in a workspace — only for workspace members (`archieved` + `isArchived`). */
export const getWorkspaceArchivedTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Same access rule as getWorkspaceDetails: only members resolve this document
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).select("_id name color description");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
        success: false,
      });
    }

    const projects = await Project.find({ workspace: workspaceId }).select("_id");
    const projectIds = projects.map((p) => p._id);

    if (projectIds.length === 0) {
      return res.status(200).json({
        workspace: {
          _id: workspace._id,
          name: workspace.name,
          color: workspace.color,
          description: workspace.description,
        },
        tasks: [],
      });
    }

    const tasks = await Task.find({
      project: { $in: projectIds },
      $or: [{ archieved: true }, { isArchived: true }],
    })
      .populate("assignees", "name email profilePicture")
      .populate("createdBy", "name email profilePicture")
      .populate({
        path: "project",
        select:
          "title description workspace status progress startDate dueDate members",
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      workspace: {
        _id: workspace._id,
        name: workspace.name,
        color: workspace.color,
        description: workspace.description,
      },
      tasks,
    });
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
          // "title status dueDate archieved priority updatedAt project"
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


export const getWorkspaceInvitationPreview = async (req, res) => {
  try {
    const { token } = req.query;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'This invitation link is invalid or has expired.',
      });
    }

    if (decoded.purpose !== 'workspace-invite' || !decoded.inviteId) {
      return res.status(400).json({
        success: false,
        message: 'This invitation link is invalid.',
      });
    }

    const invite = await WorkspaceInvite.findById(decoded.inviteId)
      .populate({
        path: 'workspaceId',
        select: 'name description color owner',
        populate: { path: 'owner', select: 'name email' },
      });

    if (!invite || invite.expiresAt < new Date() || invite.token !== token) {
      return res.status(400).json({
        success: false,
        message: 'This invitation has expired or is no longer valid.',
      });
    }

    const ws = invite.workspaceId;
    if (!ws) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found.',
      });
    }

    return res.status(200).json({
      success: true,
      workspace: {
        _id: ws._id,
        name: ws.name,
        description: ws.description,
        color: ws.color,
      },
      inviter: ws.owner
        ? { name: ws.owner.name, email: maskEmail(ws.owner.email) }
        : null,
      role: invite.role,
      invitedEmailMasked: maskEmail(invite.invitedEmail),
    });
  } catch (err) {
    console.log('getWorkspaceInvitationPreview error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const acceptWorkspaceInvitation = async (req, res) => {
  try {
    const { token } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'This invitation link is invalid or has expired.',
      });
    }

    if (decoded.purpose !== 'workspace-invite' || !decoded.inviteId) {
      return res.status(400).json({
        success: false,
        message: 'This invitation link is invalid.',
      });
    }

    const invite = await WorkspaceInvite.findById(decoded.inviteId);

    if (!invite || invite.expiresAt < new Date() || invite.token !== token) {
      return res.status(400).json({
        success: false,
        message: 'This invitation has expired or is no longer valid.',
      });
    }

    const userEmail = (req.user.email || '').trim().toLowerCase();
    if (!userEmail || userEmail !== invite.invitedEmail) {
      return res.status(403).json({
        success: false,
        message: `Sign in as ${invite.invitedEmail} to accept this invitation.`,
      });
    }

    const workspace = await Workspace.findById(invite.workspaceId);
    if (!workspace) {
      await WorkspaceInvite.deleteOne({ _id: invite._id });
      return res.status(404).json({
        success: false,
        message: 'Workspace no longer exists.',
      });
    }

    const memberRole = workspaceMemberRole(invite.role);

    const already = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (already) {
      await WorkspaceInvite.deleteOne({ _id: invite._id });
      return res.status(200).json({
        success: true,
        message: 'You are already a member of this workspace.',
        workspaceId: workspace._id,
        alreadyMember: true,
      });
    }

    workspace.members.push({
      user: req.user._id,
      role: memberRole,
      jointAt: new Date(),
    });
    await workspace.save();
    await WorkspaceInvite.deleteOne({ _id: invite._id });

    return res.status(200).json({
      success: true,
      message: 'Welcome! You joined the workspace.',
      workspaceId: workspace._id,
    });
  } catch (err) {
    console.log('acceptWorkspaceInvitation error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        message: 'Workspace not found',
        success: false,
      });
    }

    const userMemberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMemberInfo || !['admin', 'owner'].includes(userMemberInfo.role)) {
      return res.status(403).json({
        message: 'You are not authorized to invite members to this workspace',
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const isMember = workspace.members.some(
        (mem) => mem.user.toString() === existingUser._id.toString()
      );
      if (isMember) {
        return res.status(400).json({
          message: 'This user is already a member of this workspace',
          success: false,
        });
      }
    }

    const inviteRole =
      role && ['admin', 'member', 'viewer'].includes(role) ? role : 'member';

    const pending = await WorkspaceInvite.findOne({
      workspaceId,
      invitedEmail: normalizedEmail,
    });

    if (pending && pending.expiresAt > new Date()) {
      return res.status(400).json({
        message: 'An invitation is already pending for this email',
        success: false,
      });
    }

    if (pending) {
      await WorkspaceInvite.deleteOne({ _id: pending._id });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const doc = {
      workspaceId,
      invitedEmail: normalizedEmail,
      role: inviteRole,
      token: '__pending__',
      expiresAt,
    };
    if (existingUser) doc.user = existingUser._id;

    const inviteDoc = await WorkspaceInvite.create(doc);

    const inviteToken = jwt.sign(
      {
        purpose: 'workspace-invite',
        inviteId: inviteDoc._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await WorkspaceInvite.updateOne({ _id: inviteDoc._id }, { token: inviteToken });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const invitationLink = `${frontend}/workspace-invite?token=${encodeURIComponent(inviteToken)}`;

    const safeName = String(workspace.name).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const emailContent = `
      <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 12px;font-size:20px;">You're invited to <strong>${safeName}</strong></h2>
        <p style="margin:0 0 16px;">${escapeHtml(req.user.name) || "Someone"} invited you as <strong>${inviteRole}</strong>.</p>
        <a href="${invitationLink}"
           style="display:inline-block;padding:12px 20px;border-radius:12px;background:#6366f1;color:#fff;
           text-decoration:none;font-weight:600">Accept invitation</a>
        <p style="margin:20px 0 0;font-size:13px;color:#64748b">This link expires in 7 days.</p>
      </div>
    `;

    const sent = await sendEmail(
      normalizedEmail,
      `Invitation to join ${workspace.name} on Taskio`,
      emailContent
    );

    if (!sent) {
      await WorkspaceInvite.deleteOne({ _id: inviteDoc._id });
      return res.status(500).json({
        success: false,
        message: 'Could not send the invitation email. Try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (err) {
    console.log('inviteUserToWorkspace error : ', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

function findMembership(workspace, userId) {
  const id = userId.toString();
  return workspace.members.find((m) => m.user.toString() === id);
}

function isAdminOrOwnerRole(role) {
  return role === 'owner' || role === 'admin';
}

export const updateWorkspaceMeta = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, color } = req.body;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.user': req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    const me = findMembership(workspace, req.user._id);
    if (!me || !isAdminOrOwnerRole(me.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only owners and admins can edit workspace settings',
      });
    }

    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (color !== undefined) workspace.color = color;

    await workspace.save();

    return res.status(200).json({
      success: true,
      message: 'Workspace updated',
      workspace,
    });
  } catch (err) {
    console.log('updateWorkspaceMeta error : ', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const deleteWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.user': req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the workspace owner can delete this workspace',
      });
    }

    const projects = await Project.find({ workspace: workspaceId }).select(
      '_id'
    );
    const projectIds = projects.map((p) => p._id);

    await Task.deleteMany({ project: { $in: projectIds } });
    await Project.deleteMany({ workspace: workspaceId });
    await WorkspaceInvite.deleteMany({ workspaceId });
    await Message.deleteMany({ workspace: workspaceId });
    await Conversation.deleteMany({ workspace: workspaceId });
    await Workspace.findByIdAndDelete(workspaceId);

    return res.status(200).json({
      success: true,
      message: 'Workspace and its projects were deleted',
    });
  } catch (err) {
    console.log('deleteWorkspaceById error : ', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const removeWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId, memberUserId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.user': req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    const requester = findMembership(workspace, req.user._id);
    const target = findMembership(workspace, memberUserId);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this workspace',
      });
    }

    if (target.role === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'The workspace owner cannot be removed',
      });
    }

    const isSelf = req.user._id.toString() === memberUserId;

    if (isSelf) {
      workspace.members = workspace.members.filter(
        (m) => m.user.toString() !== memberUserId
      );
      await workspace.save();
      return res.status(200).json({
        success: true,
        message: 'You left the workspace',
      });
    }

    if (!requester || !isAdminOrOwnerRole(requester.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only owners and admins can remove other members',
      });
    }

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== memberUserId
    );
    await workspace.save();

    return res.status(200).json({
      success: true,
      message: 'Member removed',
      workspace,
    });
  } catch (err) {
    console.log('removeWorkspaceMember error : ', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const updateWorkspaceMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberUserId } = req.params;
    const { role } = req.body;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      'members.user': req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    const requester = findMembership(workspace, req.user._id);
    if (!requester || !isAdminOrOwnerRole(requester.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only owners and admins can change member roles',
      });
    }

    const idx = workspace.members.findIndex(
      (m) => m.user.toString() === memberUserId
    );
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this workspace',
      });
    }

    if (workspace.members[idx].role === 'owner') {
      return res.status(400).json({
        success: false,
        message: 'The owner role cannot be changed here',
      });
    }

    workspace.members[idx].role = role;
    await workspace.save();

    const populated = await Workspace.findById(workspaceId).populate(
      'members.user',
      'name email profilePicture'
    );

    return res.status(200).json({
      success: true,
      message: 'Member role updated',
      workspace: populated,
    });
  } catch (err) {
    console.log('updateWorkspaceMemberRole error : ', err);
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};