import { z } from 'zod';

const noEmojiRegex = /^[^\p{Extended_Pictographic}]*$/u;

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const workspaceIdParamsSchema = z.object({
  workspaceId: objectIdSchema,
});

export const conversationIdParamsSchema = z.object({
  workspaceId: objectIdSchema,
  conversationId: objectIdSchema,
});

export const messageIdParamsSchema = z.object({
  workspaceId: objectIdSchema,
  messageId: objectIdSchema,
});

export const sendMessageBodySchema = z.object({
  conversationId: objectIdSchema,
  body: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message is too long')
    .refine((s) => s.trim().length > 0, 'Message cannot be empty'),
});

export const editMessageBodySchema = z.object({
  body: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message is too long')
    .refine((s) => s.trim().length > 0, 'Message cannot be empty'),
});

export const messagesQuerySchema = z.object({
  conversationId: objectIdSchema,
  before: z.string().datetime().optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0 && n <= 100)
    .optional(),
});

export const createConversationBodySchema = z.object({
  type: z.enum(['channel', 'dm']).default('channel'),
  name: z
    .string()
    .min(2, 'Channel name must be at least 2 characters')
    .max(60, 'Channel name is too long')
    .regex(noEmojiRegex, 'No emojis in channel name')
    .optional(),
  memberId: objectIdSchema.optional(),
});
