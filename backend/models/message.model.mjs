import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: { type: String, trim: true, required: true, maxlength: 4000 },
    editedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
