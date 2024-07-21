import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cud_globalVolunteerSettings, CUDGlobalVolunteerSettingsArgs, find_globalVolunteerSettings, get_globalVolunteerSetting, GlobalVolunteerSettingFindManyArgs } from "./actions"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"


export type UseFindGlobalVolunteerSettingsOptions = {
  find_many: GlobalVolunteerSettingFindManyArgs
}

export const useGlobalVolunteerSettings = () => {
  return useQuery({
    queryKey: ["globalVolunteerSettings"],
    queryFn: async () => {
      const result = await get_globalVolunteerSetting()
      return result
    }
  })

}

export const useFindGlobalVolunteerSettings = (options: UseFindGlobalVolunteerSettingsOptions) => {
  return useQuery({
    queryKey: ["globalVolunteerSettings", options],
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