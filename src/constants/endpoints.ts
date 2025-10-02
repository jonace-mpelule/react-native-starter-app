/** biome-ignore-all lint/correctness/noUnusedPrivateClassMembers: <''> */
export class Endpoints {
    #_:unknown

    public static readonly LoginRoute = '/v1/auth/login'
    public static readonly RegisterRoute = '/v1/auth/register'
    public static readonly  LogoutRoute = '/v1/auth/logout'
    public static readonly RefreshTokenRoute = '/v1/auth/refresh'

}
