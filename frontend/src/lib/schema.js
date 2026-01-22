// schema/loginSchema.js
import { z } from "zod";

const noEmojiRegex = /^[^\p{Extended_Pictographic}]*$/u;
const fullNameRegex = /^[A-Za-z]+( [A-Za-z]+)?$/;
const noSpaceRegex = /^\S*$/;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .regex(noEmojiRegex, "Emojis are not allowed in email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(noSpaceRegex, "Spaces are not allowed in password")
    .regex(noEmojiRegex, "Emojis are not allowed in password"),
});

export const emailSchema = z.object({
  email: z
    .string()
    .regex(noEmojiRegex, "Emojis are not allowed in email")
    .email("Invalid email address"),
});


export const signupSchema = z
  .object({

    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .regex(noEmojiRegex, "Emojis are not allowed in full name")
      .regex(
        fullNameRegex,
        "Full name can contain letters and only one space (e.g. Muhammad Ayaz)"
      ),
    email: z
      .string()
      .email("Invalid email address")
      .regex(noEmojiRegex, "Emojis are not allowed in email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(noSpaceRegex, "Spaces are not allowed in password")
      .regex(noEmojiRegex, "Emojis are not allowed in password"),

    confirmPassword: z
      .string()
      .min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  
  export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(noSpaceRegex, "Spaces are not allowed in password")
      .regex(noEmojiRegex, "Emojis are not allowed in password"),

    confirmPassword: z
      .string()
      .min(6, "Confirm password is required")
      .regex(noSpaceRegex, "Spaces are not allowed in password")
      .regex(noEmojiRegex, "Emojis are not allowed in password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const verfiyEmailSchema = z.object({
    token : z.string().min(1,"Token is required")
  })



  export const workspaceSchema = z.object({
    
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .regex(noEmojiRegex, "Emojis are not allowed in name")
     ,
    color: z
      .string()
      .min(3, "Color must be at least 3 characters")
      .regex(noEmojiRegex, "Emojis are not allowed in color"),
    
      description: z
      .string()
      .optional()

  })
  