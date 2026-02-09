import express from 'express'
import { validateSchema } from "../libs/validateSchema.mjs";
import { projectSchema,workspaceParamsSchema } from "../libs/validate-schema.mjs";
import authMiddleware from '../middleware/auth.middleware.mjs'
import { createProject } from '../controller/project.controller.mjs';
const router = express.Router()
router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateSchema({
    body: projectSchema,
    params: workspaceParamsSchema,
  }),
  createProject
);

export default router