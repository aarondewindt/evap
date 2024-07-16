import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useCreateEvents, useDeleteEvents, useGetEventsById, useUpdateEvents } from "@/server_actions/events/hooks"
import { useNProgress } from "@/utils/use_nprogress"


export const useInject = (state: State, s: Selectors) => {
  const state_1 = useInjectValue(state, "queries", "events", 
    useGetEventsById(s.sel_query_events_args(state))
  )

  const { mutate: update_events, mutateAsync: update_events_async, ...update_events_mutation } = useUpdateEvents()
  const state_2 = useInjectValue(state_1, "mutations", "update_events", update_events_mutation)

  const { mutate: create_events, mutateAsync: create_events_async, ...create_events_mutation } = useCreateEvents()
  const state_3 = useInjectValue(state_2, "mutations", "create_events", create_events_mutation)

  const { mutate: delete_events, mutateAsync: delete_events_async, ...delete_events_mutation } = useDeleteEvents()
  const state_final = useInjectValue(state_3, "mutations", "delete_events", delete_events_mutation)

  // useNProgress(s.sel_is_fetching(state_final))

  return {
    state: state_final,
    injected_actions: {
      update_events,
      update_events_async,
      create_events,
      create_events_async,
      delete_events,
      delete_events_async
    }
  }
}


export const useInjectValue = <S extends keyof State, K extends keyof (State[S])>
                        (state: State, storage: S,  key: K,  value: State[S][K]): State => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], [key]: value }}
    return new_state
  }, [state, storage, key, value])                     
}
