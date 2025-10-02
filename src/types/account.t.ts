export type Account = {
    id:          string | null;
    phoneNumber: string | null;
    email:       string | null;
    role:        string | null;
    lastLogin:   Date | null;
    createdAt:   Date | null;
    updatedAt:   Date | null;
}


export type Tokens = {
    accessToken:  string;
    refreshToken: string;
}