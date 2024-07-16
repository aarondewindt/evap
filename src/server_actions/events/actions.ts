'use server'

import { prisma, Prisma } from "@/db"
import { get_session } from "@/server_actions/session/actions"
import { check_permission } from "@/server_actions/session/check_permission"


export type Event = Prisma.EventGetPayload<{}>
export type EventFindManyArgs = Parameters<typeof prisma.event.findMany>[0]
export type EventUpdateArgs = Parameters<typeof prisma.event.update>[0]
export type EventUpdateManyArgs = Parameters<typeof prisma.event.updateMany>[0]
export type EventCreateArgs = Parameters<typeof prisma.event.create>[0]
export type EventCreateManyArgs = Parameters<typeof prisma.event.createMany>[0]
export type EventDeleteArgs = Parameters<typeof prisma.event.delete>[0]
export type EventDeleteManyArgs = Parameters<typeof prisma.event.deleteMany>[0]

export const get_all_event = async () => {
  const events = await prisma.event.findMany()
  return events
}


export const get_events_by_id = async (ids: string[]) => {
  const events = await prisma.event.findMany({
    where: {
      id: {
        in: ids
      }
    }
  })
  return events
}


export const find_many_events = async (args: EventFindManyArgs) => {
  const events = await prisma.event.findMany(args)
  return events
}


export const update_events = async (args: EventUpdateArgs[]) => {
  const session = await get_session()
  if (check_permission(session, [])) {
    return []
  }

  return await Promise.all(
    args.map(async (a) => {
      return await prisma.event.update(a)
    })
  )
}


export const create_events = async (args: EventCreateArgs[]) => {
  const session = await get_session()
  if (check_permission(session, [])) {
    return []
  }

  const created_events = await Promise.all(
    args.map(async (a) => {
      const created_event = await prisma.event.create(a)
      return created_event
    })
  )
  return created_events
}


export const delete_events = async (ids: string[]) => {
  const session = await get_session()
  if (check_permission(session, [])) {
    return []
  }
  
  const deleted_events = await prisma.event.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })

  return deleted_events
}


export type CUDEventsArgs = {
  create?: EventCreateArgs[],
  create_many?: EventCreateManyArgs[],
  update?: EventUpdateArgs[],
  update_many?: EventUpdateManyArgs[],
  delete_?: EventDeleteArgs[],
  delete_many?: EventDeleteManyArgs[]
}

export const cud_events = async (args: CUDEventsArgs) => {
    const session = await get_session()
    if (check_permission(session, [])) {
      return []
    }

    const { create, create_many, update, update_many, delete_, delete_many } = args

    const created_promise = Promise.all(
      (create ?? []).map(async (a) => {
        const created_event = await prisma.event.create(a)
        return created_event
      })
    )

    const created_many_promise = Promise.all(
      (create_many ?? []).map(async (a) => {
        const created_event = await prisma.event.createMany(a)
        return created_event
      })
    )

    const updated_promise = Promise.all(
      (update ?? []).map(async (a) => {
        const updated_event = await prisma.event.update(a)
        return updated_event
      })
    )

    const updated_many_promise = Promise.all(
      (update_many ?? []).map(async (a) => {
        const updated_event = await prisma.event.updateMany(a)
        return updated_event
      })
    )

    const deleted_promise = Promise.all(
      (delete_ ?? []).map(async (a) => {
        return await prisma.event.delete(a)
      })
    )

    const deleted_many_promise = Promise.all(
      (delete_many ?? []).map(async (a) => {
        const deleted_event = await prisma.event.deleteMany(a)
        return deleted_event
      })
    )

    const events = await Promise.all([
      created_promise,
      created_many_promise,
      updated_promise,
      updated_many_promise,
      deleted_promise,
      deleted_many_promise
    ])

    const [ created_events, created_many_events, updated_events, 
      updated_many_events, deleted_events, deleted_many_events ] = events

  return { created_events, created_many_events, updated_events, 
    updated_many_events, deleted_events, deleted_many_events }
}
