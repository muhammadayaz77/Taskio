import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';
import Workspace from '../models/workspace.model.mjs';
import Conversation from '../models/conversation.model.mjs';

let ioInstance = null;
const presenceMap = new Map();

export function getIO() {
  return ioInstance;
}

function trackPresence(userId, socketId) {
  const set = presenceMap.get(userId) || new Set();
  set.add(socketId);
  presenceMap.set(userId, set);
  return set.size === 1;
}

function untrackPresence(userId, socketId) {
  const set = presenceMap.get(userId);
  if (!set) return false;
  set.delete(socketId);
  if (set.size === 0) {
    presenceMap.delete(userId);
    return true;
  }
  presenceMap.set(userId, set);
  return false;
}

export function isUserOnline(userId) {
  return presenceMap.has(String(userId));
}

export function getOnlineUserIds() {
  return Array.from(presenceMap.keys());
}

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173'],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');
      if (!token) return next(new Error('Missing auth token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.userId) return next(new Error('Invalid token'));
      const user = await User.findById(decoded.userId).select(
        '_id name email profilePicture'
      );
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    socket.join(`user:${userId}`);
    const wentOnline = trackPresence(userId, socket.id);
    if (wentOnline) {
      socket.broadcast.emit('presence:online', { userId });
    }

    socket.on('workspace:join', async (workspaceId, ack) => {
      try {
        const ws = await Workspace.findOne({
          _id: workspaceId,
          'members.user': socket.user._id,
        }).select('_id');
        if (!ws) {
          ack?.({ ok: false, message: 'Workspace not found' });
          return;
        }
        socket.join(`workspace:${workspaceId}`);
        ack?.({ ok: true, onlineUserIds: getOnlineUserIds() });
      } catch (err) {
        ack?.({ ok: false, message: 'Could not join workspace' });
      }
    });

    socket.on('workspace:leave', (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
    });

    socket.on('typing:start', async ({ workspaceId, conversationId }) => {
      if (!workspaceId || !conversationId) return;
      try {
        const conv = await Conversation.findOne({
          _id: conversationId,
          workspace: workspaceId,
        }).select('type members');
        if (!conv) return;
        const payload = {
          conversationId,
          userId,
          name: socket.user.name,
        };
        if (conv.type === 'dm') {
          conv.members.forEach((uid) => {
            const target = `user:${uid.toString()}`;
            if (target !== `user:${userId}`) {
              io.to(target).emit('typing:start', payload);
            }
          });
        } else {
          socket
            .to(`workspace:${workspaceId}`)
            .emit('typing:start', payload);
        }
      } catch {}
    });

    socket.on('typing:stop', async ({ workspaceId, conversationId }) => {
      if (!workspaceId || !conversationId) return;
      try {
        const conv = await Conversation.findOne({
          _id: conversationId,
          workspace: workspaceId,
        }).select('type members');
        if (!conv) return;
        const payload = { conversationId, userId };
        if (conv.type === 'dm') {
          conv.members.forEach((uid) => {
            const target = `user:${uid.toString()}`;
            if (target !== `user:${userId}`) {
              io.to(target).emit('typing:stop', payload);
            }
          });
        } else {
          socket
            .to(`workspace:${workspaceId}`)
            .emit('typing:stop', payload);
        }
      } catch {}
    });

    socket.on('disconnect', () => {
      const wentOffline = untrackPresence(userId, socket.id);
      if (wentOffline) {
        socket.broadcast.emit('presence:offline', { userId });
      }
    });
  });

  ioInstance = io;
  return io;
}
