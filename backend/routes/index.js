import express from 'express'
import authRouter from '../routes/auth.route.mjs'
import workspaceRouter from '../routes/workspace.route'
letrouter = express.Router()

router.use("/auth",authRouter)
router.use("/workspaces",workspaceRouter)

export default router