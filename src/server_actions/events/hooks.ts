import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { create_events, cud_events, CUDEventsArgs, delete_events, EventCreateArgs, EventFindManyArgs, EventUpdateArgs, find_many_events, get_all_event, get_events_by_id, update_events } from "./actions"


export const useGetAllEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const events = await get_all_event()
      return events
    }
  })
}

export const useGetEventsById = (ids: string[]) => {
  return useQuery({
    queryKey: ["events", ...ids],
    queryFn: async () => {
      if (ids.length === 0) return []
      return await get_events_by_id(ids)
    },
  })
}

export const useUpdateEvents = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: EventUpdateArgs[]) => {
      const updated_events = await update_events(args)
      queryClient.invalidateQueries({ queryKey: ["events"] })
      return updated_events
    }
  })
}

export const useCreateEvents = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: EventCreateArgs[]) => {
      const created_events = await create_events(args)
      queryClient.invalidateQueries({ queryKey: ["events"] })
      return created_events
    }
  })
}

export const useDeleteEvents = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const deleted_events = await delete_events(ids)
      queryClient.invalidateQueries({ queryKey: ["events"] })
      return deleted_events
    }
  })
}

export const useFindManyEvents = (args: EventFindManyArgs) => {
  return useQuery({
    queryKey: ["events", args],
    queryFn: async () => {
      return await find_many_events(args)
    },
  })
}

export const useCUDEvents = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: CUDEventsArgs) => {
      const result = await cud_events(args)
      queryClient.invalidateQueries({ queryKey: ["events"] })
      return result
    }
  })
}
