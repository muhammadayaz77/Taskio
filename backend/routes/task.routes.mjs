import express from "express";

import {
  createTask,
  getTaskById,
  updateTaskAssignees,
  updateTaskDescription,
  updateTaskPriority,
  updateTaskStatus,
  updateTittleName,
} from "../controller/task.controller.mjs";
import authMiddleware from "../middleware/auth.middleware.mjs";
import {
  createTaskSchema,
  projectParamsSchema,
  taskAssigneesSchema,
  taskDescriptionSchema,
  taskParamsSchema,
  taskPrioritySchema,
  taskStatusSchema,
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
router.put(
  "/:taskId/status",
  authMiddleware,
  validateSchema({
    body: taskStatusSchema,
    params: taskParamsSchema,
  }),
  updateTaskStatus,
);
router.put(
  "/:taskId/priority",
  authMiddleware,
  validateSchema({
    body: taskPrioritySchema,
    params: taskParamsSchema,
  }),
  updateTaskPriority,
);
router.put(
  "/:taskId/assignees",
  authMiddleware,
  validateSchema({
    body: taskAssigneesSchema,
    params: taskParamsSchema,
  }),
  updateTaskAssignees,
);

export default router;
