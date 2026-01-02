import express from 'express'
import {login, register} from '../controller/auth.controller.js'
import {validateRequest} from 'zod-express-middleware'
import { loginSchema, registerSchema } from '../libs/validate-schema.js'
let router = express.Router()

router.post("/login",
  validateRequest({
    body : loginSchema
  })
  ,login)
router.post("/register"
  // validateRequest({
  //   body : registerSchema
  // })
  ,register)

export default router