import express from 'express'
import {login, register, resetPasswordRequest, verifyEmail, verifyResetPassword} from '../controller/auth.controller.mjs'
import {validateRequest} from 'zod-express-middleware'
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verfiyEmailSchema } from '../libs/validate-schema.mjs'
import { validateSchema } from '../libs/validateSchema.mjs'
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
router.post("/reset-password-request",
  validateSchema(emailSchema)
  ,resetPasswordRequest) 
router.post("/reset-password",
  validateSchema(resetPasswordSchema)
  ,verifyResetPassword) 

export default router