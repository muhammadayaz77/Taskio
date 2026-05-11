  // schema/loginSchema.js
  import { z } from "zod";
  import Task from "../models/task.model.mjs";

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
  export const inviteMemberSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .regex(noEmojiRegex, "Emojis are not allowed in email"),
    role: z.enum(["admin", "member", "viewer"]).optional(),
  });

  export const acceptWorkspaceInviteSchema = z.object({
    token: z.string().min(1, "Invitation token is required"),
  });

  export const workspaceInvitePreviewQuerySchema = z.object({
    token: z.string().min(1, "Invitation token is required"),
  });

  export const updateProfileSchema = z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(80, "Name is too long")
        .regex(noEmojiRegex, "Emojis are not allowed in name")
        .regex(
          fullNameRegex,
          "Full name can contain letters and only one space"
        )
        .optional(),
      profilePicture: z
        .union([
          z.string().url("Must be a valid image URL"),
          z.literal(""),
        ])
        .optional(),
    })
    .refine(
      (data) =>
        data.name !== undefined || data.profilePicture !== undefined,
      { message: "Nothing to update", path: ["name"] }
    );

  export const changePasswordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, "Current password is required")
        .regex(noEmojiRegex, "Emojis are not allowed"),
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

  export const updateWorkspacePatchSchema = z
    .object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .regex(noEmojiRegex, "Emojis are not allowed in name")
        .optional(),
      description: z.string().optional(),
      color: z
        .string()
        .min(3, "Color must be at least 3 characters")
        .regex(noEmojiRegex, "Emojis are not allowed in color")
        .optional(),
    })
    .refine(
      (data) =>
        data.name !== undefined ||
        data.description !== undefined ||
        data.color !== undefined,
      { message: "Provide at least one field", path: ["name"] }
    );

  export const workspaceMemberRouteParamsSchema = z.object({
    workspaceId: z.string().min(1, "Workspace ID is required"),
    memberUserId: z.string().min(1, "Member ID is required"),
  });

  export const workspaceMemberRolePatchSchema = z.object({
    role: z.enum(["admin", "member", "viewer"], {
      errorMap: () => ({ message: "Invalid role" }),
    }),
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
    export const projectParamsSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
  });
    export const taskParamsSchema = z.object({
    taskId : z.string().min(1, "Task ID is required"),
  });


  export const createTaskSchema = z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title is too long"),

    description: z.string().optional(),

    status: z.enum(["To Do", "In Progress", "Done"], {
      errorMap: () => ({ message: "Status is required" }),
    }),

    priority: z.enum(["Low", "Medium", "High"], {
      errorMap: () => ({ message: "Priority is required" }),
    }),

    dueDate: z.string().optional(),

    assignees: z
      .array(
        z.object({
          user: z.coerce.string().min(1),
        })
      )
      .default([]),
  });

  export const taskTittleNameSchema = z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title is too long"),
  })

  export const taskDescriptionSchema = z.object({
    description : z
      .string()
      .optional()
  })
  export const taskStatusSchema = z.object({
    status: z.enum(["To Do", "In Progress", "Done"], {
      errorMap: () => ({ message: "Status is required" }),
    }),
  })
  export const taskAssigneesSchema = z.object({
    assignees : z.array(z.string())
  })

  export const taskPrioritySchema =  z.object({
      priority : z.enum(["Low", "Medium", "High"], {
      errorMap: () => ({ message: "Priority is required" }),
    })})

export const completedSchema = z.object({
  completed: z.boolean(),
});

export const subTaskParamsSchema = z.object({
    taskId : z.string().min(1, "Sub task ID is required"),
    subTaskId : z.string().min(1, "Sub task ID is required"),
  });
export const activityParamsSchema = z.object({
    resourceId : z.string().min(1, "Rescource ID is required"),
  });