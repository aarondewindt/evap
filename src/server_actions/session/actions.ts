'use server'

import { prisma } from "@/db"
import { auth } from "@/auth"
import { AppSession } from "./types"


export const get_session = async (): Promise<AppSession> =>{
  const auth_session = await auth()
  
  if (!auth_session?.user?.name || !auth_session?.user?.email) return { authenticated: false }

  const user = await prisma.user.findUnique({
    where: {
      email: auth_session.user.email
    }
  })

  if (!user) return { authenticated: false }

  return { 
    authenticated: true,
    user: {
      name: auth_session.user.name,
      email: auth_session.user.email,
      image: auth_session.user.image ?? null,
      is_superuser: user.is_superuser
    }
  }
}
