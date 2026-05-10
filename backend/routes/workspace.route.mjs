import express from 'express';
import { validateSchema } from '../libs/validateSchema.mjs';
import {
  inviteMemberSchema,
  workspaceParamsSchema,
  workspaceSchema,
  acceptWorkspaceInviteSchema,
  workspaceInvitePreviewQuerySchema,
} from '../libs/validate-schema.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import {
  acceptWorkspaceInvitation,
  createWorkspace,
  getWorkspace,
  getWorkspaceArchivedTasks,
  getWorkspaceDetails,
  getWorkspaceInvitationPreview,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
} from '../controller/workspace.controller.mjs';

const router = express.Router();

router.get(
  '/invitations/preview',
  validateSchema({ query: workspaceInvitePreviewQuerySchema }),
  getWorkspaceInvitationPreview
);

router.post(
  '/invitations/accept',
  authMiddleware,
  validateSchema({ body: acceptWorkspaceInviteSchema }),
  acceptWorkspaceInvitation
);

router.post(
  '/',
  authMiddleware,
  validateSchema({ body: workspaceSchema }),
  createWorkspace
);

router.post(
  '/:workspaceId/invitations',
  authMiddleware,
  validateSchema({
    body: inviteMemberSchema,
    params: workspaceParamsSchema,
  }),
  inviteUserToWorkspace
);

router.get('/', authMiddleware, getWorkspace);

router.get('/:workspaceId', authMiddleware, getWorkspaceDetails);

router.get('/:workspaceId/projects', authMiddleware, getWorkspaceProjects);

router.get('/:workspaceId/stats', authMiddleware, getWorkspaceStats);

router.get('/:workspaceId/archived-tasks', authMiddleware, getWorkspaceArchivedTasks);

export default router;
