import express from 'express'
import authRouter from '../routes/auth.route.mjs'
let router = express.Router()

router.use("/auth",authRouter)

export default router