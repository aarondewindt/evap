import { useCallback } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { View } from "react-big-calendar"


export const useActions = <TEvent extends object, TResource extends object>(
      state: State<TEvent, TResource>,
      s: ReturnType<typeof useSelectors<TEvent, TResource>>,
      a: ReturnType<typeof useInject<TEvent, TResource>>['injected_actions'],
      set_state: (recipe: (draft: Draft<State<TEvent, TResource>>)=>void)=>void) => {
  
  const on_calendar_navigate = useCallback((date: Date) => {
    set_state((draft) => {
      draft.memory.date = date
    })
  }, [ set_state ])

  const on_calendar_view_change = useCallback((view: View) => {
    set_state((draft) => {
      draft.memory.view = view
    })
  }, [ set_state ])

  return {
    on_calendar_navigate,
    on_calendar_view_change,
  }
}
