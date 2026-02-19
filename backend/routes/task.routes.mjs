import express from "express";

import {
  createTask,
  getTaskById,
  updateTaskDescription,
  updateTittleName,
} from "../controller/task.controller.mjs";
import authMiddleware from "../middleware/auth.middleware.mjs";
import {
  createTaskSchema,
  projectParamsSchema,
  taskDescriptionSchema,
  taskParamsSchema,
  taskTittleNameSchema,
} from "../libs/validate-schema.mjs";
import { validateSchema } from "../libs/validateSchema.mjs";
const router = express.Router();

router.post(
  "/:projectId/create-task",
  authMiddleware,
  validateSchema({
    body: createTaskSchema,
    params: projectParamsSchema,
  }),
  createTask,
);
router.get(
  "/:taskId",
  authMiddleware,
  validateSchema({
    // body: createTaskSchema,
    params: taskParamsSchema,
  }),
  getTaskById,
);

router.put(
  "/:taskId/title",
  authMiddleware,
  validateSchema({
    body: taskTittleNameSchema,
    params: taskParamsSchema,
  }),
  updateTittleName,
);
router.put(
  "/:taskId/description",
  authMiddleware,
  validateSchema({
    body: taskDescriptionSchema,
    params: taskParamsSchema,
  }),
  updateTaskDescription,
);
export default router;
