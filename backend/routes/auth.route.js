import express from 'express'
import {login} from '../controller/auth.controller.js'

let router = express.Router()

router.use("/login",login)

export default router