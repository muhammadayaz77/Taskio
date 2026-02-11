import express from 'express'
import { validateSchema } from "../libs/validateSchema.mjs";
import { projectParamsSchema, projectSchema,workspaceParamsSchema } from "../libs/validate-schema.mjs";
import authMiddleware from '../middleware/auth.middleware.mjs'
import { createProject, getProjectDetails, getProjectTasks } from '../controller/project.controller.mjs';
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
router.get(
  "/:projectId",
  authMiddleware,
  validateSchema({
    body: projectSchema,
    params: projectParamsSchema,
  }),
  getProjectDetails
);
router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateSchema({
    body: projectSchema,
    params: projectParamsSchema,
  }),
  getProjectTasks
);

export default router