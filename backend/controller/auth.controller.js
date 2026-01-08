import User from '../models/user.model.mjs'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import Verification from '../models/verification.model.mjs';
import {sendEmail} from '../libs/send-email.js'
import aj from '../libs/arcjet.js';
// creating a team 
export const register = async (req, res) => {
  try {
    const { fullName,email,password } = req.body;
    
    const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);
    
    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid Email address" }));
    }

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
      {userId:newUser._id,purpose : 'email-verification'},
      process.env.JWT_SECRET,
      {expiresIn : '1h'}
    )

    await Verification.create({
      userId : newUser._id,
      token : verificationToken,
      expiresAt : new Date(Date.now() + 1 * 60 * 60 * 1000)
    })

    // send email
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`; 
      const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
      const emailSubject = "Verify your email"

      const isEmailSent = await sendEmail(email,emailSubject,emailBody)
      console.log("isemail sent : ",isEmailSent)
      if(!isEmailSent){
        return res.status(500).json({
          message : 'Failed to send verification email',
          success : false
        })
      }
    return res.status(201).json({ 
      message: 'Verification email sent to your email. Please check and verify your account.',
      success : false
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Internal Server error',
      error : errors.message
    
    });
  }
};
export const login = async (req, res) => {
  try {
    const { fullName,email,password } = req.body;
    
    const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);
    
    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid Email address" }));
    }

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
      {userId:newUser._id,purpose : 'email-verification'},
      process.env.JWT_SECRET,
      {expiresIn : '1h'}
    )

    await Verification.create({
      userId : newUser._id,
      token : verificationToken,
      expiresAt : new Date(Date.now() + 1 * 60 * 60 * 1000)
    })

    // send email
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email/token=${verificationToken}`; 
      const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
      const emailSubject = "Verify your email"

      const isEmailSent = await sendEmail(email,emailSubject,emailBody)
      console.log("isemail sent : ",isEmailSent)
      if(!isEmailSent){
        return res.status(500).json({
          message : 'Failed to send verification email',
          success : false
        })
      }
    return res.status(201).json({ 
      message: 'Verification email sent to your email. Please check and verify your account.',
      success : false
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Internal Server error',
      error : errors.message
    
    });
  }
};


export const verifyEmail = async (req, res) => {
        try {
          const { token } = req.body;

          console.log("token : ",token)

          let payload = jwt.verify(token,process.env.JWT_SECRET);
          let {userId,purpose} = payload;

          if(purpose !== 'email-verification'){
          return res.status(401).json({ message: 'Unauthorized' });
          }
          const verification = await Verification.findOne({
            userId,
            token
          })
          if(!verification){
          return res.status(401).json({ message: 'Unauthorized' });

          }
          const isTokenExpired = verification.expiresAt < new Date();
          if(isTokenExpired){
            return res.status(401).json({ message: 'Token expired' });
  
            }
          const user = await User.findById(userId);
          if(!user){
            return res.status(401).json({ message: 'Unauthorized' });
            }
            if(user.isEmailVerified){
              return res.status(400).json({ message: 'Email already verified' });
              }
              user.isEmailVerified = true;
              await user.save();
              
              await Verification.findByIdAndDelete(verification._id)
          res.status(201).json({ message: 'Email Verified Successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Internal server error', error });
        }
      };