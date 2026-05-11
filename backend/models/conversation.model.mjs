import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['channel', 'dm'],
      default: 'channel',
      index: true,
    },
    name: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessageAt: { type: Date, default: Date.now },
    lastMessagePreview: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

conversationSchema.index({ workspace: 1, type: 1, isDefault: 1 });
conversationSchema.index({ workspace: 1, members: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
