import express from 'express'
import {login, register, resetPasswordRequest, verifyEmail, verifyResetPassword, getMe, updateProfile, changePassword} from '../controller/auth.controller.mjs'
import {validateRequest} from 'zod-express-middleware'
import { emailSchema, loginSchema, registerSchema, resetPasswordSchema, verfiyEmailSchema, updateProfileSchema, changePasswordSchema } from '../libs/validate-schema.mjs'
import { validateSchema } from '../libs/validateSchema.mjs'
import authMiddleware from '../middleware/auth.middleware.mjs'
let router = express.Router()

router.post("/login",
  validateRequest({
    body : loginSchema
  })
  ,login);

router.get("/me", authMiddleware, getMe);
router.patch(
  "/profile",
  authMiddleware,
  validateRequest({ body: updateProfileSchema }),
  updateProfile,
);
router.patch(
  "/password",
  authMiddleware,
  validateRequest({ body: changePasswordSchema }),
  changePassword,
);
  
router.post("/register",
  validateSchema({ body: registerSchema })
  ,register)
router.post("/verify-email",
  validateSchema({ body: verfiyEmailSchema })
  ,verifyEmail)
router.post("/reset-password-request",
  validateSchema({ body: emailSchema })
  ,resetPasswordRequest) 
router.post("/reset-password",
  validateSchema({ body: resetPasswordSchema })
  ,verifyResetPassword) 

export default router