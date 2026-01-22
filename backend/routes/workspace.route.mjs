import express from 'express';
import { validateSchema } from '../libs/validateSchema.mjs';
import { workspaceSchema } from '../libs/validate-schema.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createWorkspace } from '../controller/workspace.controller.mjs';


const router = express.Router();


router.post("/", 
    authMiddleware,
    validateSchema(workspaceSchema)
  ,createWorkspace)


export default router;