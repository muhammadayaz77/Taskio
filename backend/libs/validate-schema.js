// schema/loginSchema.js
import { z } from "zod";

const noEmojiRegex = /^[^\p{Extended_Pictographic}]*$/u;
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

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .regex(noEmojiRegex, "Emojis are not allowed in full name")
      .regex(noSpaceRegex, "Spaces are not allowed in full name"),

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
  