
import NextAuth from "next-auth"
import auth_config from "./auth.config"
 
export const { auth: middleware } = NextAuth(auth_config)
