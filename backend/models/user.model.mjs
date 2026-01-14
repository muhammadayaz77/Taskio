// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { 
      type: String,
       required: true,
        unique: true,
        trim : true,
        lowercase : true
      },
    password: { 
      type: String,
       required: true,
       select : false
       },
       profilePicture : {
        type : String
       },
       isEmailVerified : {
        type : Boolean,
        default : false
       },
       lastLogin : {
        type : Date
       },
       is2FAEnabled : {
        type : Boolean,
        default : false
       },
       twoFAOtp : {
        type : String,
        select : false
       },
       twoFAOtpExpires : {
        type : Date,
        select : false
       }
  },
  { timestamps: true }
);



// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Token generation method
// userSchema.methods.generateAuthToken = async function () {
//   const user = this;

//   const token = jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   // Save token to tokens array
//   user.tokens.push(token);
//   await user.save();

//   return token;
// };

const User = mongoose.model("User", userSchema);
export default User;
