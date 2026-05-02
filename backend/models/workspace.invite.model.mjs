import mongoose from 'mongoose';

const workspaceInviteSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Workspace',
    required:true
},
  role : {
    type: String, 
    enum: ["admin","member","viewer"], 
    default: "member"
  },
  token : {
    type: String,
    required : true
  },
  expiresAt : {
    type : Date,
    required : true
  }

}, { timestamps: true });

const WorkspaceInvite = mongoose.model('WorkspaceInvite', workspaceInviteSchema);
export default WorkspaceInvite;