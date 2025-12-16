import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import mongoose from 'mongoose'


export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, specialization , status } = req.body;

    if (!dueDate || isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ message: 'A valid dueDate is required.' });
    }

    if (!specialization) {
      return res.status(400).json({ message: 'Specialization is required to assign the task.' });
    }

    const managerId = req.user._id;

    // Step 1: Find busy developers (with active tasks)
    const busyDeveloperIds = await Task.find({ status: { $in: ['todo', 'progress'] } }).distinct('assignedTo');

    // Step 2: Find free developers with the given specialization, not currently busy, created by the current manager
    const freeDevelopers = await User.find({
      role: 'developer',
      specialization,
      _id: { $nin: busyDeveloperIds },
      managerId // Assuming each developer has a managerId field
    });

    if (freeDevelopers.length === 0) {
      return res.status(404).json({ message: 'No free developer available with this specialization.' });
    }

    // Optionally, pick the least busy (advanced: skip if you want first one)
    let selectedDeveloper = freeDevelopers[0];



    // Step 3: Create and assign task
    const task = await Task.create({
      title,
      description,
      dueDate: new Date(dueDate),
      assignedTo: new mongoose.Types.ObjectId(selectedDeveloper._id),
      status,
      managerId: managerId,
    });

    res.status(201).json({
      message: 'Task created and assigned successfully.',
      task,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// creating task
// export const createTask = async (req, res) => {
//   try {

//     const { title, description, dueDate, developerId } = req.body;

//     if (!dueDate || isNaN(Date.parse(dueDate))) {
//       return res.status(400).json({ message: 'A valid dueDate is required.' });
//     }

//     let assignedDeveloper;

//     if (developerId) {
//       // Check if developer is free
//       const busyDevelopers = await Task.find({ status: { $in: ['todo', 'progress'] } }).distinct('assignedTo');

//       if (busyDevelopers.includes(developerId)) {
//         return res.status(400).json({ message: 'Selected developer is currently busy.' });
//       }

//       assignedDeveloper = await User.findOne({ _id: developerId, role: 'developer' });
//       if (!assignedDeveloper) {
//         return res.status(404).json({ message: 'Developer not found.' });
//       }
//     } else {
//       // Auto assign free developer
//       const busyDevelopers = await Task.find({ status: { $in: ['todo', 'progress'] } }).distinct('assignedTo');
//       assignedDeveloper = await User.findOne({ role: 'developer', _id: { $nin: busyDevelopers } });

//       if (!assignedDeveloper) {
//         return res.status(404).json({ message: 'No free developer available.' });
//       }
//     }

//     const task = await Task.create({
//       title,
//       description,
//       dueDate: new Date(dueDate),
//       assignedTo: assignedDeveloper._id,
//       managerId: req.user._id
//     });

//     res.status(201).json({
//       message: 'Task created and assigned successfully.',
//       task
//     });

//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };



// filter tasks on the basis of todo progress compoleted 


export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.query; // e.g., ?status=todo or ?status=all

    let filter = {managerId: req.user._id};
    if (status && status !== 'all') {
      filter.status = status;  // filter by todo/progress/completed
    }

    const tasks = await Task.find(filter).populate('assignedTo', 'name email specialization');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// filter task on the basis of developer names



export const getTasksByDeveloperName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Developer name is required in query.' });
    }

    // Find developers whose name matches (case-insensitive)
    const matchedDevelopers = await User.find({
      role: 'developer',
      name: { $regex: new RegExp(name, 'i') }  // case-insensitive search
    }).select('_id');

    const developerIds = matchedDevelopers.map(dev => dev._id);

    const tasks = await Task.find({ assignedTo: { $in: developerIds }, managerId: req.user._id }).populate('assignedTo', 'name');

    res.json({ tasks });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// update task
export const updateTask = async (req, res) => {
  try {


    const { id } = req.params;
    
    const { title, assignedTo ,description,dueDate,status } = req.body;

    const task = await Task.findById(id);
    if (!task || task.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Task does not belong to you.' });
    }

    if (!title && !assignedTo) {
      return res.status(400).json({ message: 'At least one of title or assignedTo must be provided.' });
    }

    // Prepare update object with allowed fields only
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (status) updates.status = status;
    if (dueDate) updates.dueDate = dueDate;

    if (assignedTo) {
      // Check if developer is free (ignore current task)
      const busyDevelopers = await Task.find({ status: { $in: ['todo', 'progress'] }, _id: { $ne: id } }).distinct('assignedTo');
      if (busyDevelopers.includes(assignedTo)) {
        return res.status(400).json({ message: 'Selected developer is currently busy.' });
      }
      updates.assignedTo = assignedTo;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task updated successfully.', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// delete task 

export const deleteTask = async (req, res) => {
  try {
 

    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask || deletedTask.managerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Task does not belong to you.' });
    }

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export  const AllTasks  = async (req, res) => {
  try {
    const tasks = await Task.find({ managerId: req.user._id }).populate("assignedTo").sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get tasks', error: error.message });
  }
};
