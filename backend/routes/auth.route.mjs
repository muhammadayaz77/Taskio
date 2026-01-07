import express from 'express'
import {login, register, verifyEmail} from '../controller/auth.controller.js'
import {validateRequest} from 'zod-express-middleware'
import { loginSchema, registerSchema, verfiyEmailSchema } from '../libs/validate-schema.js'
import { validateSchema } from '../libs/validateSchema.js'
let router = express.Router()

router.post("/login",
  validateRequest({
    body : loginSchema
  })
  ,login)
  
router.post("/register",
  validateSchema(registerSchema)
  ,register)
router.post("/verify-email",
  validateSchema(verfiyEmailSchema)
  ,verifyEmail)

export default router