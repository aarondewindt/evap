import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cud_locations, CUDLocationsArgs, find_many_locations, LocationFindManyArgs } from "./actions"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"


export type UseFindLocationsOptions = {
  args: LocationFindManyArgs
  enabled?: boolean
}

export const useFindManyLocations = (options: UseFindLocationsOptions) => {
  return useQuery({
    enabled: options.enabled,
    queryKey: ["locations", options.args],
    queryFn: async () => {
      return await find_many_locations(options.args)
    }
  })
}

export const useCUDLocations = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: CUDLocationsArgs) => {
      const result = await cud_locations(args)
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      return result
    }
  })
}