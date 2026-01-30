import User from "../models/user.model.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.model.mjs";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";
import { date } from "zod";
// creating a team
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const decision = await aj.protect(req, { email }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    if (decision.isDenied()) {
      if (decision.isDenied()) {
        return res.status(403).json({
          message: "Invalid Email address",
          success: false,
        });
      }
    }

    let existUser = await User.findOne({ email });
    console.log("User");
    // console.log(existUser);
    if (existUser && existUser.isEmailVerified) {
      return res.status(400).json({
        message: "Email address already in use",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
 

    // const managerId = req.user._id;
    let newUser = await User.create({
      name: fullName,
      email,
      password : hashedPassword,
    });

    const user = {
      name: newUser.name,
      email: newUser.email,
    };

    // send email
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    console.log("isemail sent : ", isEmailSent);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
        success: false,
      });
    }

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    return res.status(201).json({
      message:
        "Verification email sent to your email. Please check and verify your account.",
      success: false,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("body : ",email,password)

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
      });
      if (existingVerification && existingVerification.expiresAt > Date.now()) {
        return res.status(400).json({
          message:
            "Email not verified.Please check your email for the verification link.  ",
          success: false,
        });
      } else {
        await Verification.deleteMany({ userId: user._id });
        const verificationToken = jwt.sign(
          {
            userId: user._id,
            purpose: "email-verification",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(+1 * 60 * 60 * 1000),
        });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
        const emailSubject = "Verify your email";

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);
        if (!isEmailSent) {
          return res.status(500).json({
            message: "Failed to send verification email",
            success: false,
          });
        }
        return res.status(201).json({
          message:
            "Verification email sent to your email. Please check and verify your account.",
          success: false,
        });
      }
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("is password : ",user.password) 
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    let token = jwt.sign(
      {
        userId: user._id,
        purpose: "login",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.lastLogin = new Date();
    await user.save();

    const userDate = user.toObject();
    delete userDate.password;

    return res.status(200).json({
      message: "Your are logged in",
      token,
      user: userDate,
      success: true,
    });
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};
export const resetPasswordRequest  = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found ",
        success: false,
      });
    }
    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    const existingVerification = Verification.findOne({
      userId: user._id,
    });
    if (existingVerification && existingVerification.expiresAt > new Date()) {
      return res.status(400).json({
        message: "Reset Password request already sent ",
        success: false,
      });
    }
    if (existingVerification && existingVerification.expiresAt < new Date()) {
      await Verification.findByIdAndDelete(existingVerification._id);
    }

    let resetPasswordToken = jwt.sign(
      {
        userId: user._id,
        purpose: "reset-password",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const verificationLink = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Reset your password";
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    console.log("isemail sent : ", isEmailSent);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Reset Password email sent",
      success: true,
    });
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};

export const verifyResetPassword = async (req, res) => {
  try {
    const { token,newPassword,confirmPassword } = req.body;
    
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let { userId, purpose } = payload;
    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verification = await Verification.findOne({
      userId,
      token,
    });
    console.log("Verification : ", payload);
    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(newPassword !== confirmPassword){
        return res.status(401).json({ message: "Password do not match" });
    }
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(newPassword,salt);

   user.password = hashedPassword;
   await user.save();

   await Verification.findByIdAndDelete(verification._id);
    res.status(200).json({ message: "Password reset Successfully" });
  } catch (error) {
    console.log("error : ",error)
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;


    let payload = jwt.verify(token, process.env.JWT_SECRET);
    let { userId, purpose } = payload;

    console.log("purpose :", purpose);
    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verification = await Verification.findOne({
      userId,
    });
    console.log("Payload : ", payload);
    console.log("Verification : ", verification);
    const user = await User.findById(userId);
    console.log('user : ',user)
    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);
    res.status(201).json({ message: "Email Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
