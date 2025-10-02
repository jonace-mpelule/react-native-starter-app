import { z } from 'zod'


export const AuthZodSchema = z.object({
    userId: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    role: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    authenticated: z.boolean(),
})


export type AuthType = z.infer<typeof AuthZodSchema>
