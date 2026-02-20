import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignees : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    watchers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    completedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
    },
    subTasks: [
      {
        title: {
          type: String ,
          required: true,
        },  
        completed: {
          type: Boolean,
          default: false
        },
        createdAt : {
          type : Date,
          default : Date.now
        }
      },
    ],
    comments : [
      {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Comment"
    }
  ],
    tags: [
      {
        type: String,
      },
    ],
    attachments : [{
      fileName : { type : String, required : true},
      fileUrl : { type : String, required : true},
      fileType : { type : String},
      fileSize : { type : Number},
      uploadBy : { type : mongoose.Schema.Types.ObjectId,ref : "User"},
      updatedAt : { type : Date, default : Date.now},
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
