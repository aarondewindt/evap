'use server'

import { prisma, Prisma } from "@/db"

export type Location = Prisma.LocationGetPayload<{}>
export type LocationFindFirstArgs = Parameters<typeof prisma.location.findFirst>[0]
export type LocationFindUniqueArgs = Parameters<typeof prisma.location.findUnique>[0]
export type LocationFindManyArgs = Parameters<typeof prisma.location.findMany>[0]
export type LocationUpdateArgs = Parameters<typeof prisma.location.update>[0]
export type LocationUpdateManyArgs = Parameters<typeof prisma.location.updateMany>[0]
export type LocationCreateArgs = Parameters<typeof prisma.location.create>[0]
export type LocationCreateManyArgs = Parameters<typeof prisma.location.createMany>[0]
export type LocationDeleteArgs = Parameters<typeof prisma.location.delete>[0]
export type LocationDeleteManyArgs = Parameters<typeof prisma.location.deleteMany>[0]


export const find_many_locations = async (args: LocationFindManyArgs) => {
  return await prisma.location.findMany(args)
}

export type CUDLocationsArgs = {
  create?: LocationCreateArgs[],
  create_many?: LocationCreateManyArgs[],
  update?: LocationUpdateArgs[],
  update_many?: LocationUpdateManyArgs[],
  delete_?: LocationDeleteArgs[],
  delete_many?: LocationDeleteManyArgs[]
}


export const cud_locations = async (args: CUDLocationsArgs) => {
  const { create, create_many, update, update_many, delete_, delete_many } = args

  const created_promise = Promise.all(
    (create ?? []).map(async (a) => {
      const created_event = await prisma.location.create(a)
      return created_event
    })
  )

  const created_many_promise = Promise.all(
    (create_many ?? []).map(async (a) => {
      const created_event = await prisma.location.createMany(a)
      return created_event
    })
  )

  const updated_promise = Promise.all(
    (update ?? []).map(async (a) => {
      const updated_event = await prisma.location.update(a)
      return updated_event
    })
  )

  const updated_many_promise = Promise.all(
    (update_many ?? []).map(async (a) => {
      const updated_event = await prisma.location.updateMany(a)
      return updated_event
    })
  )

  const deleted_promise = Promise.all(
    (delete_ ?? []).map(async (a) => {
      return await prisma.location.delete(a)
    })
  )

  const deleted_many_promise = Promise.all(
    (delete_many ?? []).map(async (a) => {
      const deleted_event = await prisma.location.deleteMany(a)
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

  const [ created_locations, created_many_locations, updated_locations, 
    updated_many_locations, deleted_locations, deleted_many_locations ] = mutation_results

  return {
    create: created_locations,
    create_many: created_many_locations,
    update: updated_locations,
    update_many: updated_many_locations,
    delete_: deleted_locations,
    delete_many: deleted_many_locations
  }
}
