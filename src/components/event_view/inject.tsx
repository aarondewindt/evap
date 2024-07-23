import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useCUDEvents, useFindManyEvents } from "@/server_actions/events/hooks"


export const useInject = (state: State, s: Selectors) => {
  const events_mutation = useCUDEvents()

  const state_1 = useInjectValues(state, "injected", {
    events_query: useFindManyEvents(s.sel_events_query_args(state)),
    events_mutation
  })

  return {
    state: state_1,
    injected_actions: {
      cud_events: events_mutation.mutateAsync
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

export const useInjectValues = <S extends keyof State, K extends keyof (State[S])>
                        (state: State, storage: S, values: {[key in K]: State[S][K]} ): State => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], ...values }}
    return new_state
  }, [state, storage, values])                     
}
