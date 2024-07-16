'use server'

import { prisma, Prisma } from "@/db"
import { get_session } from "@/server_actions/session/actions"
import { check_permission } from "@/server_actions/session/check_permission"
import { DefaultArgs } from "@prisma/client/runtime/library"


export type Volunteer = Prisma.VolunteerGetPayload<{}>
export type VolunteerUpdateArgs = Parameters<typeof prisma.volunteer.update>[0]


export const get_all_volunteers = async () => {
  return await prisma.volunteer.findMany()
}

export const get_volunteers_by_id = async <T extends Prisma.VolunteerInclude<DefaultArgs>,>(ids: string[], include?: T) => {
  return await prisma.volunteer.findMany({
    where: {
      id: {
        in: ids
      }
    },
    include: include
  })
}

export const update_volunteers = async (args: VolunteerUpdateArgs[]) => {
  const session = await get_session()
  if (check_permission(session, [])) {
    return []
  }

  const updated_volunteers = await Promise.all(
    args.map(async (a) => {
      const updated_volunteer = await prisma.volunteer.update(a)
      return updated_volunteer
    })
  )

  return updated_volunteers
}

export const create_volunteers = async (volunteers: Omit<Volunteer, "id">[]) => {
  const session = await get_session()
  if (check_permission(session, [])) {
    return []
  }

  const created_volunteers = await Promise.all(
    volunteers.map(async (volunteer) => {
      const created_volunteer = await prisma.volunteer.create({
        data: volunteer
      })
      return created_volunteer
    })
  )
  return created_volunteers
}

export const delete_volunteers = async (ids: string[]) => {
  const session = await get_session()
  if (check_permission(session, [])) {
    return []
  }

  const deleted_volunteers = await Promise.all(
    ids.map(async (id) => {
      const deleted_volunteer = await prisma.volunteer.delete({
        where: {
          id
        }
      })
      return deleted_volunteer
    })
  )
  return deleted_volunteers
}
