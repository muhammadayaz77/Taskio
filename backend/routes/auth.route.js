import express from 'express'
import {login, register} from '../controller/auth.controller.js'
import {validateRequest} from 'zod-express-middleware'
import { loginSchema, registerSchema } from '../libs/validate-schema.js'
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

export default router