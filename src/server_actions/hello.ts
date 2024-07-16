'use server'

import { auth } from "@/auth"
import { prisma } from "@/db"


export async function hello() {
  const session = await auth()

  // const users = await prisma.user.findMany()

  const is_logged_in = !!session

  return { hello: "world", is_logged_in, user: session?.user }
}
