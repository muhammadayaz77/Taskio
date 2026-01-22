import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description:{
    type: String, trim: true
  },
  color: {
    type: String, 
    trim: true,
    default : "#3B82F6"
},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
  members: [{
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  role : {
    type: String, 
    emun: ["owner","member"], 
    default: "member"
  },
  jointAt : {
    type: Date,
    default : Date.now
  },
  projects : [{
    type : mongoose.Schema.Types.ObjectId,
    ref :'Project'   
  }]
}],

}, { timestamps: true });

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;