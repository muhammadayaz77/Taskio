import express from 'express';
import { validateSchema } from '../libs/validateSchema.mjs';
import { inviteMemberSchema, workspaceParamsSchema, workspaceSchema } from '../libs/validate-schema.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createWorkspace, getWorkspace, getWorkspaceArchivedTasks, getWorkspaceDetails, getWorkspaceProjects, getWorkspaceStats } from '../controller/workspace.controller.mjs';
import {inviteUserToWorkspace} from '../controller/workspace.controller.mjs'

const router = express.Router();


router.post("/", 
    authMiddleware,
    validateSchema(workspaceSchema)
  ,createWorkspace)
router.post("/?workspaceId/invite-member", 
    authMiddleware,
   
     validateSchema({
       body: inviteMemberSchema,
       params: workspaceParamsSchema,
     }),
  inviteUserToWorkspace)
router.get("/", 
    authMiddleware,
  getWorkspace)
router.get("/:workspaceId", 
    authMiddleware,
  getWorkspaceDetails)
router.get("/:workspaceId/projects",
    authMiddleware,
  getWorkspaceProjects)
router.get("/:workspaceId/stats",
    authMiddleware,
  getWorkspaceStats)
router.get(
  "/:workspaceId/archived-tasks",
  authMiddleware,
  getWorkspaceArchivedTasks,
);


export default router;