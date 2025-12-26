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
  