import express from 'express';
import { validateSchema } from '../libs/validateSchema.mjs';
import {
  inviteMemberSchema,
  workspaceParamsSchema,
  workspaceSchema,
  acceptWorkspaceInviteSchema,
  workspaceInvitePreviewQuerySchema,
  updateWorkspacePatchSchema,
  workspaceMemberRouteParamsSchema,
  workspaceMemberRolePatchSchema,
} from '../libs/validate-schema.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import {
  acceptWorkspaceInvitation,
  createWorkspace,
  deleteWorkspaceById,
  getWorkspace,
  getWorkspaceArchivedTasks,
  getWorkspaceDetails,
  getWorkspaceInvitationPreview,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
  removeWorkspaceMember,
  updateWorkspaceMeta,
  updateWorkspaceMemberRole,
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

router.patch(
  '/:workspaceId/members/:memberUserId',
  authMiddleware,
  validateSchema({
    params: workspaceMemberRouteParamsSchema,
    body: workspaceMemberRolePatchSchema,
  }),
  updateWorkspaceMemberRole
);

router.delete(
  '/:workspaceId/members/:memberUserId',
  authMiddleware,
  validateSchema({
    params: workspaceMemberRouteParamsSchema,
  }),
  removeWorkspaceMember
);

router.patch(
  '/:workspaceId',
  authMiddleware,
  validateSchema({
    params: workspaceParamsSchema,
    body: updateWorkspacePatchSchema,
  }),
  updateWorkspaceMeta
);

router.delete(
  '/:workspaceId',
  authMiddleware,
  validateSchema({
    params: workspaceParamsSchema,
  }),
  deleteWorkspaceById
);

router.get('/', authMiddleware, getWorkspace);

router.get('/:workspaceId', authMiddleware, getWorkspaceDetails);

router.get('/:workspaceId/projects', authMiddleware, getWorkspaceProjects);

router.get('/:workspaceId/stats', authMiddleware, getWorkspaceStats);

router.get('/:workspaceId/archived-tasks', authMiddleware, getWorkspaceArchivedTasks);

export default router;
