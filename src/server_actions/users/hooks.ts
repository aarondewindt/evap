import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cud_users, CUDUsersArgs, find_users, UserFindManyArgs } from "./actions"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"


export type UseFindUsersOptions = {
  find_many: UserFindManyArgs
}

export const useFindUsers = (options: UseFindUsersOptions) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await find_users(options.find_many)
    }
  })
}

export const useCUDUsers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: CUDUsersArgs) => {
      const result = await cud_users(args)
      queryClient.invalidateQueries({ queryKey: ["users"] })
      return result
    }
  })
}