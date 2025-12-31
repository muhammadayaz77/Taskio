import express from 'express'
import {login, register} from '../controller/auth.controller.js'
import {z} from 'zod'
import {validateRequest} from 'zod-express-middleware'
import { loginSchema, registerSchema } from '../libs/validate-schema.js'
let router = express.Router()

router.use("/login",
  validateRequest({
    body : loginSchema
  })
  ,login)
router.use("/register",
  validateRequest({
    body : registerSchema
  })
  ,register)

export default router