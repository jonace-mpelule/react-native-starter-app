import { type } from "arktype"

export const user = type({
    id: "number",
    username: "string",
    email: "string",
    dateCreated: "Date",
    updatedAt: "Date"
})

export type User = typeof user.t