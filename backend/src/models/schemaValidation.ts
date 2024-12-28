import { z } from 'zod';
import { Prisma, UserStatus } from "@prisma/client"


export const signupBody = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  // email: z.string().email({ message: "Invalid email address" }),
  avatarUrl: z.string().url().optional(),
  status: z.nativeEnum(UserStatus).default('OFFLINE').optional(),  // Use Prisma's enum
  lastSeen: z.date().optional(),
}).strict(); 

export const loginBody = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export const searchFriendBody = z.object({
  email: z.string().email({ message: "Invalid email address" }),
}).strict();

// Create TypeScript type from Zod schema
export type UserCreateInput = z.infer<typeof signupBody>;