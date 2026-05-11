import express from 'express';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { validateSchema } from '../libs/validateSchema.mjs';
import {
  conversationIdParamsSchema,
  createConversationBodySchema,
  editMessageBodySchema,
  messageIdParamsSchema,
  messagesQuerySchema,
  sendMessageBodySchema,
  workspaceIdParamsSchema,
} from '../libs/chat-validate.mjs';
import {
  createConversation,
  deleteMessage,
  editMessage,
  listConversations,
  listMessages,
  sendMessage,
} from '../controller/chat.controller.mjs';

const router = express.Router({ mergeParams: true });

router.get(
  '/:workspaceId/chat/conversations',
  authMiddleware,
  validateSchema({ params: workspaceIdParamsSchema }),
  listConversations
);

router.post(
  '/:workspaceId/chat/conversations',
  authMiddleware,
  validateSchema({
    params: workspaceIdParamsSchema,
    body: createConversationBodySchema,
  }),
  createConversation
);

router.get(
  '/:workspaceId/chat/messages',
  authMiddleware,
  validateSchema({
    params: workspaceIdParamsSchema,
    query: messagesQuerySchema,
  }),
  listMessages
);

router.post(
  '/:workspaceId/chat/messages',
  authMiddleware,
  validateSchema({
    params: workspaceIdParamsSchema,
    body: sendMessageBodySchema,
  }),
  sendMessage
);

router.patch(
  '/:workspaceId/chat/messages/:messageId',
  authMiddleware,
  validateSchema({
    params: messageIdParamsSchema,
    body: editMessageBodySchema,
  }),
  editMessage
);

router.delete(
  '/:workspaceId/chat/messages/:messageId',
  authMiddleware,
  validateSchema({
    params: messageIdParamsSchema,
  }),
  deleteMessage
);

export default router;
