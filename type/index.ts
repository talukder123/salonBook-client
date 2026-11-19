export type IuserRole = "user" | "admin";

export type Tuser = {
    name : string,
    email : string,
    image?: string | null,
    role?: string | null 
}