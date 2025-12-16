// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['manager', 'developer'], default: 'developer' },
  specialization: { type: String },
  tokens: [String],
  managerId: {
  type: String
}
},{timestamps:true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Token generation method
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Save token to tokens array
  user.tokens.push(token);
  await user.save();

  return token;
};



const User = mongoose.model('User', userSchema);
export default User;