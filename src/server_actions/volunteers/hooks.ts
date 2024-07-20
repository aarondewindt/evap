import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cud_volunteers, CUDVolunteersArgs, find_volunteers, VolunteerFindManyArgs } from "./actions"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"


export const useFindVolunteers = (args: VolunteerFindManyArgs) => {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      return await find_volunteers(args)
    }
  })
}

export const useCUDVolunteers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: CUDVolunteersArgs) => {
      const result = await cud_volunteers(args)
      queryClient.invalidateQueries({ queryKey: ["volunteers"] })
      return result
    }
  })
}