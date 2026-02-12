import express from 'express';

import {createTask } from '../controller/task.controller.mjs';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createTaskSchema, projectParamsSchema } from '../libs/validate-schema.mjs';
import { validateSchema } from '../libs/validateSchema.mjs';
const router = express.Router();

router.post("/:projectId/create-task" , 
    authMiddleware ,
    validateSchema({
      body: createTaskSchema,
      params: projectParamsSchema,
      }),
    createTask)


export default router;
