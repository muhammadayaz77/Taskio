import User from "../models/user.model.js";
import Task from "../models/task.model.js";

export const registerManager = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const newManager = new User({
      name,
      email,
      password,
      role: "manager",
      
  
    });

    await newManager.save();
    res.status(201).json({ message: "Manager registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.role !== role) {
      return res.status(400).json({ message: "Access denied: role mismatch" });
    }

    const token = await user.generateAuthToken();

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create developer
export const createDeveloper = async (req, res) => {
  const { name, email, password, specialization } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const newDeveloper = new User({
      name,
      email,
      password,
      role: "developer",
      specialization,
      managerId: req.user._id
    });

    await newDeveloper.save();
    res.status(201).json({ message: "Developer created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all developers

export const getAllDevelopers = async (req, res) => {
  try {
    const developers = await User.find({ role: "developer" , managerId:req.user._id }).select(
      "-password -tokens"
    ).sort({ createdAt: -1 });
    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// update the developers

export const updateDeveloper = async (req, res) => {
  const { id } = req.params;
  const { name, email, specialization } = req.body;

  try {
    const updatedDeveloper = await User.findOneAndUpdate(
      { _id: id, role: "developer" , managerId:req.user._id },
      { $set: { name, email, specialization } },
      { new: true, runValidators: true }
    ).select("-password -tokens");

    if (!updatedDeveloper) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.status(200).json({message : "developer updated successfully " , updatedDeveloper});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete the developer

export const deleteDeveloper = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.findOneAndDelete({ _id: id, role: "developer" , managerId:req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.status(200).json({ message: "Developer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// free developer

export const getFreeDevelopers = async (req, res) => {
  try {
    // Find developers who have tasks that are still active
    const busyDeveloperIds = await Task.find({
      status: { $in: ["todo", "progress"] },
      
    }).distinct("assignedTo");

    // Get developers who are NOT busy
    const freeDevelopers = await User.find({
      role: "developer",
     
      _id: { $nin: busyDeveloperIds },
    }).select("name email specialization");

    res.status(200).json(freeDevelopers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//logout manager

export const logoutManager =async (req, res) => {
    const user = await User.findById(req.user._id);
     user.tokens = []
    res.clearCookie('token');
    await user.save();
 
  return res.status(200).json({ message: " logged out successfully" });
};
