import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"


export const useInject = <TEvent extends object, TResource extends object>(state: State<TEvent, TResource>, s: Selectors<TEvent, TResource>) => {
  const state_1 = useInjectValues(state, "injected", {
    bar: "bar",
  })

  return {
    state: state_1,
    injected_actions: {}
  }
}

export const useInjectValues = <TEvent extends object, TResource extends object, S extends keyof State<TEvent, TResource>, K extends keyof (State<TEvent, TResource>[S])>
                        (state: State<TEvent, TResource>, storage: S, values: {[key in K]: State<TEvent, TResource>[S][K]} ): State<TEvent, TResource> => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], ...values }}
    return new_state
  }, [state, storage, values])                     
}
