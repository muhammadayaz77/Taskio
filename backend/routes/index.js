import express from 'express'
import authRouter from '../routes/auth.route.js'
let router = express.Router()

router.use("/auth",authRouter)

export default router