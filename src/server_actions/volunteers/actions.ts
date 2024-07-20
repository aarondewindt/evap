'use server'

import { prisma, Prisma } from "@/db"

export type Volunteer = Prisma.VolunteerGetPayload<{}>
export type VolunteerFindFirstArgs = Parameters<typeof prisma.volunteer.findFirst>[0]
export type VolunteerFindUniqueArgs = Parameters<typeof prisma.volunteer.findUnique>[0]
export type VolunteerFindManyArgs = Parameters<typeof prisma.volunteer.findMany>[0]
export type VolunteerUpdateArgs = Parameters<typeof prisma.volunteer.update>[0]
export type VolunteerUpdateManyArgs = Parameters<typeof prisma.volunteer.updateMany>[0]
export type VolunteerCreateArgs = Parameters<typeof prisma.volunteer.create>[0]
export type VolunteerCreateManyArgs = Parameters<typeof prisma.volunteer.createMany>[0]
export type VolunteerDeleteArgs = Parameters<typeof prisma.volunteer.delete>[0]
export type VolunteerDeleteManyArgs = Parameters<typeof prisma.volunteer.deleteMany>[0]


export const find_volunteers = async (args: VolunteerFindManyArgs) => {
  return await prisma.volunteer.findMany(args)
}

export type CUDVolunteersArgs = {
  create?: VolunteerCreateArgs[],
  create_many?: VolunteerCreateManyArgs[],
  update?: VolunteerUpdateArgs[],
  update_many?: VolunteerUpdateManyArgs[],
  delete_?: VolunteerDeleteArgs[],
  delete_many?: VolunteerDeleteManyArgs[]
}


export const cud_volunteers = async (args: CUDVolunteersArgs) => {
  const { create, create_many, update, update_many, delete_, delete_many } = args

  const created_promise = Promise.all(
    (create ?? []).map(async (a) => {
      const created_event = await prisma.volunteer.create(a)
      return created_event
    })
  )

  const created_many_promise = Promise.all(
    (create_many ?? []).map(async (a) => {
      const created_event = await prisma.volunteer.createMany(a)
      return created_event
    })
  )

  const updated_promise = Promise.all(
    (update ?? []).map(async (a) => {
      const updated_event = await prisma.volunteer.update(a)
      return updated_event
    })
  )

  const updated_many_promise = Promise.all(
    (update_many ?? []).map(async (a) => {
      const updated_event = await prisma.volunteer.updateMany(a)
      return updated_event
    })
  )

  const deleted_promise = Promise.all(
    (delete_ ?? []).map(async (a) => {
      return await prisma.volunteer.delete(a)
    })
  )

  const deleted_many_promise = Promise.all(
    (delete_many ?? []).map(async (a) => {
      const deleted_event = await prisma.volunteer.deleteMany(a)
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

  const [ created_volunteers, created_many_volunteers, updated_volunteers, 
    updated_many_volunteers, deleted_volunteers, deleted_many_volunteers ] = mutation_results

  return {
    create: created_volunteers,
    create_many: created_many_volunteers,
    update: updated_volunteers,
    update_many: updated_many_volunteers,
    delete_: deleted_volunteers,
    delete_many: deleted_many_volunteers
  }
}
