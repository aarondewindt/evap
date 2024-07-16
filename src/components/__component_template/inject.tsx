import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"


export const useInject = (state: State, s: Selectors) => {
  const state_1 = useInjectValue(state, "queries", "q1", 
    "" // useQuery(...)
  )

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
