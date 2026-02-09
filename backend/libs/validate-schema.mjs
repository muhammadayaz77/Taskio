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
    .email("Invalid email address")
    .regex(noEmojiRegex, "Emojis are not allowed in email"),
});

export const registerSchema = z
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
      .min(6, "Confirm password is required")
      .regex(noSpaceRegex, "Spaces are not allowed in password")
      .regex(noEmojiRegex, "Emojis are not allowed in password")
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
  
// Members
  const projectMemberSchema = z.object({
    user: z
      .string()
      .min(1, "User is required"),
  
    role: z
      .enum(["manager", "contributor","viewer"])
      .optional(), // role is optional
  });
  
  export const projectSchema = z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .regex(noEmojiRegex, "Emojis are not allowed in title"),
  
    description: z
      .string()
      .regex(noEmojiRegex, "Emojis are not allowed in description")
      .optional(),
  
    status: z.enum(["Planning","In Progress","On Hold","Completed","Cancelled"], {
      errorMap: () => ({ message: "Invalid project status" }),
    }),
  
    startDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid start date",
      }),
  
    dueDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid due date",
      }),
  
    members: z
      .array(projectMemberSchema)
      .min(1, "At least one member is required"),
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.dueDate),
    {
      message: "Due date must be after start date",
      path: ["dueDate"],
    }
  );

  export const workspaceParamsSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
});