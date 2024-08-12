import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useFindVolunteers } from "@/server_actions/volunteers/hooks"
import { useNProgress } from "@/utils/use_nprogress"


export const useInject = (state: State, s: Selectors) => {
  const state_1 = useInjectValues(state, "injected", {
    volunteers_query: useFindVolunteers(s.sel_volunteer_query_params(state)),
  })

  useNProgress(s.sel_is_loading(state_1))

  return {
    state: state_1,
    injected_actions: {}
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
