import express from 'express';
import { validateSchema } from '../libs/validateSchema';
import { workspaceSchema } from '../libs/validate-schema';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createWorkspace } from '../controller/workspace.controller';


const router = express.Router();


router.post("/", 
    authMiddleware,
    validateSchema(workspaceSchema)
  ,createWorkspace)


export default router;