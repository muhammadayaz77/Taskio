import express from 'express';
import { Auth } from '../middlewares/auth.middleware.js';
import { getMyTasks, getMyTeam, loginDeveloper, logoutDeveloper, updatePassword, updateTaskStatusByDeveloper } from '../controller/developer.controller.js';


const router = express.Router();


router.post("/login" , loginDeveloper)
router.post("/logout" , Auth , logoutDeveloper)
router.get("/team" , Auth , getMyTeam)
router.get("/task" , Auth , getMyTasks)
router.put("/task/:id" , Auth , updateTaskStatusByDeveloper)
router.put("/update/password" , Auth , updatePassword)


export default router;