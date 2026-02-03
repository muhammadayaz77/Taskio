import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    description: {
      type: String,
      trim: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentions: [
      {
        user : {
          type: mongoose.Schema.Types.ObjectId ,
          ref : 'User',
        },  
        offset: {
          type: Number
        },
        length : {
          type : Number,
        }
      },
    ],
    reactions: [
      {
        user : {
          type: mongoose.Schema.Types.ObjectId ,
          ref : 'User',
        },  
        emoji: {
          type: String
        },
        length : {
          type : Number,
        }
      },
    ],
    attachments : [{
      fileName : { type : String},
      fileUrl : { type : String},
      fileType : { type : String},
      fileSize : { type : Number},
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
