import Conversation from '../models/conversation.model.mjs';
import Message from '../models/message.model.mjs';
import Workspace from '../models/workspace.model.mjs';
import { getIO } from '../libs/socket.mjs';

const PUBLIC_MESSAGE_FIELDS =
  '_id conversation workspace sender body editedAt isDeleted createdAt updatedAt';

function membershipOf(workspace, userId) {
  const id = userId.toString();
  return workspace.members.find((m) => m.user.toString() === id);
}

function canChat(role) {
  return role === 'owner' || role === 'admin' || role === 'member';
}

function isManager(role) {
  return role === 'owner' || role === 'admin';
}

async function loadWorkspaceWithMembership(workspaceId, userId) {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    'members.user': userId,
  });
  if (!workspace) return { workspace: null, me: null };
  const me = membershipOf(workspace, userId);
  return { workspace, me };
}

async function ensureDefaultChannel(workspace) {
  const existing = await Conversation.findOne({
    workspace: workspace._id,
    type: 'channel',
    isDefault: true,
  });
  if (existing) return existing;
  return Conversation.create({
    workspace: workspace._id,
    type: 'channel',
    name: 'general',
    isDefault: true,
    members: workspace.members.map((m) => m.user),
  });
}

export const listConversations = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { workspace, me } = await loadWorkspaceWithMembership(
      workspaceId,
      req.user._id
    );
    if (!workspace || !me) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    await ensureDefaultChannel(workspace);

    const conversations = await Conversation.find({
      workspace: workspaceId,
      $or: [{ type: 'channel' }, { members: req.user._id }],
    })
      .populate('members', 'name email profilePicture')
      .sort({ isDefault: -1, lastMessageAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (err) {
    console.log('listConversations error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { type, name, memberId } = req.body;
    const { workspace, me } = await loadWorkspaceWithMembership(
      workspaceId,
      req.user._id
    );
    if (!workspace || !me) {
      return res.status(404).json({
        success: false,
        message: 'Workspace not found',
      });
    }

    if (type === 'channel') {
      if (!isManager(me.role)) {
        return res.status(403).json({
          success: false,
          message: 'Only owners and admins can create channels',
        });
      }
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Channel name is required',
        });
      }
      const conversation = await Conversation.create({
        workspace: workspace._id,
        type: 'channel',
        name: name.trim(),
        members: workspace.members.map((m) => m.user),
      });
      const populated = await Conversation.findById(conversation._id).populate(
        'members',
        'name email profilePicture'
      );
      getIO()
        ?.to(`workspace:${workspaceId}`)
        .emit('conversation:new', populated);
      return res.status(201).json({ success: true, conversation: populated });
    }

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'memberId is required for a DM',
      });
    }
    if (memberId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot DM yourself',
      });
    }
    const otherMember = workspace.members.find(
      (m) => m.user.toString() === memberId
    );
    if (!otherMember) {
      return res.status(400).json({
        success: false,
        message: 'That user is not a member of this workspace',
      });
    }

    const ids = [req.user._id.toString(), memberId].sort();
    const existing = await Conversation.findOne({
      workspace: workspaceId,
      type: 'dm',
      members: { $all: ids, $size: 2 },
    }).populate('members', 'name email profilePicture');
    if (existing) {
      return res.status(200).json({ success: true, conversation: existing });
    }

    const conversation = await Conversation.create({
      workspace: workspace._id,
      type: 'dm',
      members: ids,
    });
    const populated = await Conversation.findById(conversation._id).populate(
      'members',
      'name email profilePicture'
    );

    const io = getIO();
    if (io) {
      ids.forEach((uid) =>
        io.to(`user:${uid}`).emit('conversation:new', populated)
      );
    }

    return res.status(201).json({ success: true, conversation: populated });
  } catch (err) {
    console.log('createConversation error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

async function ensureCanAccessConversation(workspaceId, conversationId, user) {
  const { workspace, me } = await loadWorkspaceWithMembership(
    workspaceId,
    user._id
  );
  if (!workspace || !me) return { error: { status: 404, message: 'Workspace not found' } };

  const conversation = await Conversation.findOne({
    _id: conversationId,
    workspace: workspaceId,
  });
  if (!conversation) {
    return { error: { status: 404, message: 'Conversation not found' } };
  }
  if (conversation.type === 'dm') {
    const inDm = conversation.members.some(
      (m) => m.toString() === user._id.toString()
    );
    if (!inDm) {
      return { error: { status: 403, message: 'You are not in this DM' } };
    }
  }
  return { workspace, me, conversation };
}

export const listMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { conversationId, before, limit } = req.query;

    const access = await ensureCanAccessConversation(
      workspaceId,
      conversationId,
      req.user
    );
    if (access.error) {
      return res
        .status(access.error.status)
        .json({ success: false, message: access.error.message });
    }

    const pageSize = Math.min(Number(limit) || 30, 100);
    const filter = { conversation: conversationId };
    if (before) filter.createdAt = { $lt: new Date(before) };

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .populate('sender', 'name email profilePicture')
      .select(`${PUBLIC_MESSAGE_FIELDS} sender`);

    return res.status(200).json({
      success: true,
      messages: messages.reverse(),
      hasMore: messages.length === pageSize,
    });
  } catch (err) {
    console.log('listMessages error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { conversationId, body } = req.body;

    const access = await ensureCanAccessConversation(
      workspaceId,
      conversationId,
      req.user
    );
    if (access.error) {
      return res
        .status(access.error.status)
        .json({ success: false, message: access.error.message });
    }
    if (!canChat(access.me.role)) {
      return res.status(403).json({
        success: false,
        message: 'Viewers cannot send messages',
      });
    }

    const trimmed = body.trim();
    const created = await Message.create({
      conversation: conversationId,
      workspace: workspaceId,
      sender: req.user._id,
      body: trimmed,
      readBy: [req.user._id],
    });

    const populated = await Message.findById(created._id).populate(
      'sender',
      'name email profilePicture'
    );

    await Conversation.updateOne(
      { _id: conversationId },
      {
        lastMessageAt: new Date(),
        lastMessagePreview: trimmed.slice(0, 140),
      }
    );

    const io = getIO();
    if (io) {
      const target =
        access.conversation.type === 'dm'
          ? access.conversation.members.map(
              (uid) => `user:${uid.toString()}`
            )
          : [`workspace:${workspaceId}`];
      target.forEach((room) => io.to(room).emit('message:new', populated));
    }

    return res.status(201).json({ success: true, message: populated });
  } catch (err) {
    console.log('sendMessage error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { workspaceId, messageId } = req.params;
    const { body } = req.body;

    const message = await Message.findById(messageId);
    if (!message || message.workspace.toString() !== workspaceId) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }
    if (message.isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit a deleted message',
      });
    }
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages',
      });
    }

    const access = await ensureCanAccessConversation(
      workspaceId,
      message.conversation,
      req.user
    );
    if (access.error) {
      return res
        .status(access.error.status)
        .json({ success: false, message: access.error.message });
    }

    message.body = body.trim();
    message.editedAt = new Date();
    await message.save();

    const populated = await Message.findById(message._id).populate(
      'sender',
      'name email profilePicture'
    );

    const io = getIO();
    if (io) {
      const target =
        access.conversation.type === 'dm'
          ? access.conversation.members.map(
              (uid) => `user:${uid.toString()}`
            )
          : [`workspace:${workspaceId}`];
      target.forEach((room) =>
        io.to(room).emit('message:updated', populated)
      );
    }

    return res.status(200).json({ success: true, message: populated });
  } catch (err) {
    console.log('editMessage error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { workspaceId, messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message || message.workspace.toString() !== workspaceId) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    const access = await ensureCanAccessConversation(
      workspaceId,
      message.conversation,
      req.user
    );
    if (access.error) {
      return res
        .status(access.error.status)
        .json({ success: false, message: access.error.message });
    }

    const isOwn = message.sender.toString() === req.user._id.toString();
    if (!isOwn && !isManager(access.me.role)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete this message',
      });
    }

    // Update directly (bypasses validators) so re-deleting a soft-deleted
    // row remains idempotent and we never hit the "body required" rule.
    await Message.updateOne(
      { _id: message._id },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          body: '',
          editedAt: null,
        },
      }
    );

    const populated = await Message.findById(message._id).populate(
      'sender',
      'name email profilePicture'
    );

    const io = getIO();
    if (io) {
      const target =
        access.conversation.type === 'dm'
          ? access.conversation.members.map(
              (uid) => `user:${uid.toString()}`
            )
          : [`workspace:${workspaceId}`];
      target.forEach((room) =>
        io.to(room).emit('message:updated', populated)
      );
    }

    return res.status(200).json({ success: true, message: populated });
  } catch (err) {
    console.log('deleteMessage error : ', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};
