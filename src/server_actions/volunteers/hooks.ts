import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { create_volunteers, delete_volunteers, get_all_volunteers, get_volunteers_by_id, update_volunteers, Volunteer, VolunteerUpdateArgs } from "./action"
import { Prisma } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"



export const useGetAllVolunteers = () => {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      return await get_all_volunteers()
    }
  })
}

export const useGetVolunteersById = <T extends Prisma.VolunteerInclude<DefaultArgs>,>(ids: string[], include?: T) => {
  return useQuery({
    queryKey: ["volunteers", ...ids],
    queryFn: async () => {
      if (ids.length === 0) return []
      return await get_volunteers_by_id(ids, include)
    },
  })
}

export const useUpdateVolunteers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: VolunteerUpdateArgs[]) => {
      const updated_volunteers = await update_volunteers(args)
      queryClient.invalidateQueries({ queryKey: ["volunteers"] })
      return updated_volunteers
    }
  })
}

export const useCreateVolunteers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (volunteers: Omit<Volunteer, "id">[]) => {
      const created_volunteers = await create_volunteers(volunteers)
      queryClient.invalidateQueries({ queryKey: ["volunteers"] })
      return created_volunteers
    }
  })
}

export const useDeleteVolunteers = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const deleted_volunteers = await delete_volunteers(ids)
      queryClient.invalidateQueries({ queryKey: ["volunteers"] })
      return deleted_volunteers
    }
  })
}
