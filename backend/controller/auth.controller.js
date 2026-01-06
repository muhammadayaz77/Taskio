a1import User from '../models/user.model.mjs'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import Verification from '../models/verification.model.mjs';
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
    const { fullName,email,password,confirmPassword } = req.body;
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
    let newUser = await User.create({
      name : fullName,
      email,
      password
    });  
    const user = {
      name : newUser.name,
      email : newUser.email,
    }

    const verificationToken = jwt.sign(
      {userId:newUser._id,property : 'email-verification'},
      process.env.JWT_SECRET,
      {expiresIn : '1h'}
    )

    await Verification.create({
      userId : newUser._id,
      token : verificationToken,
      expiresAt : new Date(Date.now() + 1 * 60 * 60 * 1000)
    })

    // send email
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email/token=${verificationToken}`
      
      const emailBody = `<p>Click <a href="${verificationLink}>here</a> to verify your email"</p>`

      const emailSubject = "Verify your email"

      

    res.status(201).json({ message: 'Account created successfully',user});
  } catch (err) {
    res.status(500).json({ 
      message: 'Internal Server error',
      error : errors.message
    
    });
  }
};

