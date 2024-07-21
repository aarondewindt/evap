import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cud_globalVolunteerSettings, CUDGlobalVolunteerSettingsArgs, find_globalVolunteerSettings, GlobalVolunteerSettingFindManyArgs } from "./actions"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"


export type UseFindGlobalVolunteerSettingsOptions = {
  find_many: GlobalVolunteerSettingFindManyArgs
}

export const useGlobalVolunteerSettings = () => {
  return useQuery({
    queryKey: ["globalVolunteerSettings"],
    queryFn: async () => {
      const result = await find_globalVolunteerSettings({
        orderBy: { created_at: 'desc' },
        take: 1
      })
      return result[0] ?? null
    }
  })

}

export const useFindGlobalVolunteerSettings = (options: UseFindGlobalVolunteerSettingsOptions) => {
  return useQuery({
    queryKey: ["globalVolunteerSettings"],
    queryFn: async () => {
      return await find_globalVolunteerSettings(options.find_many)
    }
  })
}

export const useCUDGlobalVolunteerSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: CUDGlobalVolunteerSettingsArgs) => {
      const result = await cud_globalVolunteerSettings(args)
      queryClient.invalidateQueries({ queryKey: ["globalVolunteerSettings"] })
      return result
    }
  })
}