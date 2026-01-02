import User from '../models/user.model.mjs'
import bcrypt from 'bcryptjs';

// creating a team 
export const login = async (req, res) => {
  try {
    // const { name } = req.body;
    // const managerId = req.user._id;
    // const team = await Team.create({ name  , managerId});
    res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const register = async (req, res) => {
  try {
    const { fullName,email,password } = req.body;
    let existUser = await User.findOne({email});
    console.log("User")
    // console.log(existUser);
    if(existUser){
      return res.status(400).json({
        message : "Email address already in use",
        success : false
      })
    }

    // const managerId = req.user._id;
    let savedUser = await User.create({
      name : fullName,
      email,
      password
    });  
    const user = {
      name : savedUser.name,
      email : savedUser.email,
    }
    res.status(201).json({ message: 'Team created successfully',user});
  } catch (err) {
    res.status(500).json({ 
      message: 'Internal Server error',
      error : errors.message
    
    });
  }
};

