import express from 'express';

import { Auth } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/manager.middleware.js';
import {createTask } from '../controller/tasks.controller.js';
import authMiddleware from '../middleware/auth.middleware.mjs';
import { createTaskSchema } from '../libs/validate-schema.mjs';

const router = express.Router();

router.post("/:projectId/create-task" , authMiddleware ,
    validateSchema({
      body: createTaskSchema,
      params: projectParamsSchema,
      }),
    createTask)


export default router;
