import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import Task from '../models/task.model.js';


import bcrypt from 'bcryptjs';

// login developer
export const loginDeveloper = async (req, res) => {
  try {
    const { email, password  , role} = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });
    
    
    const user = await User.findOne({ email, role: 'developer' });
    
    if (!user) return res.status(404).json({ message: 'Developer not found.' });
    
    if(user.role !== role){
      return res.status(400).json({ message: 'Access denied: role mismatch' });

    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = await user.generateAuthToken();

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
 
      maxAge: 7 * 24 * 60 * 60 * 1000 ,
      httpOnly:true
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// developer team and team members 


export const getMyTeam = async (req, res) => {
  try {
    const developerId = req.user.id;

    // Find team that includes the current developer
    const team = await Team.findOne({ developers: developerId })
      .populate('developers', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'You are not assigned to any team.' });
    }

    res.json({
      message: 'Team fetched successfully.',
      teamName: team.name,
      members: team.developers
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// see their own tasks 

export const getMyTasks = async (req, res) => {
  try {
    if (req.user.role !== 'developer') {
      return res.status(403).json({ message: 'Access denied. Only developers can view their tasks.' });
    }

    const tasks = await Task.find({ assignedTo: req.user.id }).sort({ dueDate: 1 });

    res.json({
      message: 'Tasks fetched successfully.',
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// update task status 


export const updateTaskStatusByDeveloper = async (req, res) => {
  try {
   
    
    const  taskId  = req.params.id;
  
    
    const { status } = req.body;
    
    

    if (!['todo', 'progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find the task assigned to this developer
    const task = await Task.findOne({ _id: taskId, assignedTo: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not assigned to you.' });
    }

    task.status = status;
    await task.save();

    res.json({
      message: 'Task status updated successfully.',
      task
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const logoutDeveloper = async(req, res) => {
  const user = await User.findById(req.user._id);
     user.tokens = []
  res.clearCookie('token');
   await user.save();
  return res.status(200).json({ message: ' logged out successfully' });
};




// update password 
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // triggers pre-save hook
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};
