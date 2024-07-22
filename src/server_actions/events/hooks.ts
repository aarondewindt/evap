import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cud_events, CUDEventsArgs, EventFindManyArgs, find_many_events } from "./actions"


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
