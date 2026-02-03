import express from 'express';
import { validateSchema } from '../libs/validateSchema.mjs';
import { workspaceSchema } from '../libs/validate-schema.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createWorkspace, getWorkspace, getWorkspaceDetails } from '../controller/workspace.controller.mjs';


const router = express.Router();


router.post("/", 
    authMiddleware,
    validateSchema(workspaceSchema)
  ,createWorkspace)
router.get("/", 
    authMiddleware,
  getWorkspace)
router.get("/:workspaceId", 
    authMiddleware,
  getWorkspaceDetails)
router.get("/:workspaceId/projects",
    authMiddleware,
  getWorkspaceProjects)


export default router;