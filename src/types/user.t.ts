import z from "zod"

export const userSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profilePhoto: z.string().optional(),
    dateCreated: z.date().optional(),
    dateUpdated: z.date().optional(),
})

export type User = z.infer<typeof userSchema>
