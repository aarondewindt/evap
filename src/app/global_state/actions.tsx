import { useCallback } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const on_nav_toggle = useCallback((open?: boolean) => {
    set_state((draft) => {
      if (open !== undefined) {
        draft.memory.is_nav_open = open
      } else {
        draft.memory.is_nav_open = !draft.memory.is_nav_open
      }
    })
  }, [set_state])

  const on_aside_toggle = useCallback((open?: boolean) => {
    set_state((draft) => {
      if (open !== undefined) {
        draft.memory.is_aside_open = open
      } else {
        draft.memory.is_aside_open = !draft.memory.is_aside_open
      }
    })
  }, [set_state])

  return {
    on_nav_toggle,
    on_aside_toggle
  }
}
