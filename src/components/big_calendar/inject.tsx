import { useMemo } from "react"
import { BigCalendarEvent, State } from "./types"
import { Selectors } from "./selectors"


export const useInject = <TEvent extends BigCalendarEvent>(state: State<TEvent>, s: Selectors<TEvent>) => {
  const state_1 = useInjectValues(state, "injected", {
    bar: "bar",
  })

  return {
    state: state_1,
    injected_actions: {}
  }
}

export const useInjectValues = <TEvent extends BigCalendarEvent, S extends keyof State<TEvent>, K extends keyof (State<TEvent>[S])>
                        (state: State<TEvent>, storage: S, values: {[key in K]: State<TEvent>[S][K]} ): State<TEvent> => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], ...values }}
    return new_state
  }, [state, storage, values])                     
}
