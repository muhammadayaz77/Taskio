import express from 'express';

import { Auth } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/manager.middleware.js';
import { AllTasks, createTask, deleteTask, getTasksByDeveloperName, getTasksByStatus, updateTask } from '../controller/tasks.controller.js';

const router = express.Router();

router.post("/create" , Auth , isAdmin , createTask)
router.get('/filter',Auth , isAdmin ,  getTasksByStatus);  // GET /api/tasks?status=todo
router.get('/filter/developer/name',Auth , isAdmin ,  getTasksByDeveloperName);  // GET /api/tasks?status=todo
router.get("/get" , Auth , isAdmin , AllTasks)
router.put("/:id" , Auth , isAdmin , updateTask)
router.delete("/:id" , Auth , isAdmin , deleteTask)


export default router;
