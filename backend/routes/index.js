import express from 'express'
import authRouter from './auth.route.mjs'
import workspaceRouter from './workspace.route.mjs'
import projectRouter from './project.route.mjs'
let router = express.Router()

router.use("/auth",authRouter)
router.use("/workspaces",workspaceRouter)
router.use("/projects",projectRouter)

export default router;