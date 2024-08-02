import NextAuth from "next-auth"
import auth_config from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Prisma, prisma } from "./db"
 

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Typescript isn't aware that we have a user object from the database here.
      // So we need to cast it to the correct type.
      const typed_user = user as Prisma.UserGetPayload<{}>

      if (typed_user.email === process.env.AUTH_SUPERUSER_EMAIL) return true
      if (typed_user.email.toLowerCase().includes("@sosalsa.nl")) return true

      if (typed_user.is_superuser) return true
      if (!typed_user.is_verified) return "/unverified_user"

      return true
    }
  },

  ...auth_config
})

