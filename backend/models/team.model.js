import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  developers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  managerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Manager',
  required: true
}
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;