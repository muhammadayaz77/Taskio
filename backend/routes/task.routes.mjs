import express from 'express';

import {createTask, getTaskById } from '../controller/task.controller.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createTaskSchema, projectParamsSchema, taskParamsSchema } from '../libs/validate-schema.mjs';
import { validateSchema } from '../libs/validateSchema.mjs';
const router = express.Router();

router.post("/:projectId/create-task" , 
    authMiddleware ,
    validateSchema({
      body: createTaskSchema,
      params: projectParamsSchema,
      }),
    createTask)
router.get("/:taskId" , 
    authMiddleware ,
    validateSchema({
      // body: createTaskSchema,
      params: taskParamsSchema,
      }),
    getTaskById);


export default router;
