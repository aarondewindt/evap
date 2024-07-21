'use server'

import { prisma, Prisma } from "@/db"

export type GlobalVolunteerSetting = Prisma.GlobalVolunteerSettingGetPayload<{}>
export type GlobalVolunteerSettingFindFirstArgs = Parameters<typeof prisma.globalVolunteerSetting.findFirst>[0]
export type GlobalVolunteerSettingFindUniqueArgs = Parameters<typeof prisma.globalVolunteerSetting.findUnique>[0]
export type GlobalVolunteerSettingFindManyArgs = Parameters<typeof prisma.globalVolunteerSetting.findMany>[0]
export type GlobalVolunteerSettingUpdateArgs = Parameters<typeof prisma.globalVolunteerSetting.update>[0]
export type GlobalVolunteerSettingUpdateManyArgs = Parameters<typeof prisma.globalVolunteerSetting.updateMany>[0]
export type GlobalVolunteerSettingCreateArgs = Parameters<typeof prisma.globalVolunteerSetting.create>[0]
export type GlobalVolunteerSettingCreateManyArgs = Parameters<typeof prisma.globalVolunteerSetting.createMany>[0]
export type GlobalVolunteerSettingDeleteArgs = Parameters<typeof prisma.globalVolunteerSetting.delete>[0]
export type GlobalVolunteerSettingDeleteManyArgs = Parameters<typeof prisma.globalVolunteerSetting.deleteMany>[0]


export const find_globalVolunteerSettings = async (args: GlobalVolunteerSettingFindManyArgs) => {
  return await prisma.globalVolunteerSetting.findMany(args)
}

export type CUDGlobalVolunteerSettingsArgs = {
  create?: GlobalVolunteerSettingCreateArgs[],
  create_many?: GlobalVolunteerSettingCreateManyArgs[],
  update?: GlobalVolunteerSettingUpdateArgs[],
  update_many?: GlobalVolunteerSettingUpdateManyArgs[],
  delete_?: GlobalVolunteerSettingDeleteArgs[],
  delete_many?: GlobalVolunteerSettingDeleteManyArgs[]
}


export const cud_globalVolunteerSettings = async (args: CUDGlobalVolunteerSettingsArgs) => {
  const { create, create_many, update, update_many, delete_, delete_many } = args

  const created_promise = Promise.all(
    (create ?? []).map(async (a) => {
      const created_event = await prisma.globalVolunteerSetting.create(a)
      return created_event
    })
  )

  const created_many_promise = Promise.all(
    (create_many ?? []).map(async (a) => {
      const created_event = await prisma.globalVolunteerSetting.createMany(a)
      return created_event
    })
  )

  const updated_promise = Promise.all(
    (update ?? []).map(async (a) => {
      const updated_event = await prisma.globalVolunteerSetting.update(a)
      return updated_event
    })
  )

  const updated_many_promise = Promise.all(
    (update_many ?? []).map(async (a) => {
      const updated_event = await prisma.globalVolunteerSetting.updateMany(a)
      return updated_event
    })
  )

  const deleted_promise = Promise.all(
    (delete_ ?? []).map(async (a) => {
      return await prisma.globalVolunteerSetting.delete(a)
    })
  )

  const deleted_many_promise = Promise.all(
    (delete_many ?? []).map(async (a) => {
      const deleted_event = await prisma.globalVolunteerSetting.deleteMany(a)
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

  const [ created_globalVolunteerSettings, created_many_globalVolunteerSettings, updated_globalVolunteerSettings, 
    updated_many_globalVolunteerSettings, deleted_globalVolunteerSettings, deleted_many_globalVolunteerSettings ] = mutation_results

  return {
    create: created_globalVolunteerSettings,
    create_many: created_many_globalVolunteerSettings,
    update: updated_globalVolunteerSettings,
    update_many: updated_many_globalVolunteerSettings,
    delete_: deleted_globalVolunteerSettings,
    delete_many: deleted_many_globalVolunteerSettings
  }
}
