import express from 'express'
import authRouter from './auth.route.mjs'
import workspaceRouter from './workspace.route.mjs'
import projectRouter from './project.route.mjs'
import taskRouter from './task.routes.mjs'
import chatRouter from './chat.route.mjs'
let router = express.Router()

router.use("/auth",authRouter)
router.use("/workspaces",workspaceRouter)
router.use("/workspaces",chatRouter)
router.use("/projects",projectRouter)
router.use("/tasks",taskRouter)

export default router;
