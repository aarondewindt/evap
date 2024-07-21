'use server'

import { prisma, Prisma } from "@/db"

export type User = Prisma.UserGetPayload<{}>
export type UserFindFirstArgs = Parameters<typeof prisma.user.findFirst>[0]
export type UserFindUniqueArgs = Parameters<typeof prisma.user.findUnique>[0]
export type UserFindManyArgs = Parameters<typeof prisma.user.findMany>[0]
export type UserUpdateArgs = Parameters<typeof prisma.user.update>[0]
export type UserUpdateManyArgs = Parameters<typeof prisma.user.updateMany>[0]
export type UserCreateArgs = Parameters<typeof prisma.user.create>[0]
export type UserCreateManyArgs = Parameters<typeof prisma.user.createMany>[0]
export type UserDeleteArgs = Parameters<typeof prisma.user.delete>[0]
export type UserDeleteManyArgs = Parameters<typeof prisma.user.deleteMany>[0]


export const find_users = async (args: UserFindManyArgs) => {
  return await prisma.user.findMany(args)
}

export type CUDUsersArgs = {
  create?: UserCreateArgs[],
  create_many?: UserCreateManyArgs[],
  update?: UserUpdateArgs[],
  update_many?: UserUpdateManyArgs[],
  delete_?: UserDeleteArgs[],
  delete_many?: UserDeleteManyArgs[]
}


export const cud_users = async (args: CUDUsersArgs) => {
  const { create, create_many, update, update_many, delete_, delete_many } = args

  const created_promise = Promise.all(
    (create ?? []).map(async (a) => {
      const created_event = await prisma.user.create(a)
      return created_event
    })
  )

  const created_many_promise = Promise.all(
    (create_many ?? []).map(async (a) => {
      const created_event = await prisma.user.createMany(a)
      return created_event
    })
  )

  const updated_promise = Promise.all(
    (update ?? []).map(async (a) => {
      const updated_event = await prisma.user.update(a)
      return updated_event
    })
  )

  const updated_many_promise = Promise.all(
    (update_many ?? []).map(async (a) => {
      const updated_event = await prisma.user.updateMany(a)
      return updated_event
    })
  )

  const deleted_promise = Promise.all(
    (delete_ ?? []).map(async (a) => {
      return await prisma.user.delete(a)
    })
  )

  const deleted_many_promise = Promise.all(
    (delete_many ?? []).map(async (a) => {
      const deleted_event = await prisma.user.deleteMany(a)
      return deleted_event
    })
  )

  const mutation_results = await Promise.all([
    created_promise,
    created_many_promise,
    updated_promise,
    updated_many_promise,
    deleted_promise,
    deleted_many_promise
  ])

  const [ created_users, created_many_users, updated_users, 
    updated_many_users, deleted_users, deleted_many_users ] = mutation_results

  return {
    create: created_users,
    create_many: created_many_users,
    update: updated_users,
    update_many: updated_many_users,
    delete_: deleted_users,
    delete_many: deleted_many_users
  }
}
