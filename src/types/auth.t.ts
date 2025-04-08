import {type} from "arktype"

export const AuthType = type({
    userId: "string",
    accessToken: "string",
    refreshToken: "string",
})

export type Auth = typeof AuthType.t