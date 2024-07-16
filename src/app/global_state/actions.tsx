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
  
  const on_nav_toggle = useCallback(() => {
    console.log("nav toggle")
    set_state((draft) => {
      console.log("nav toggle")
      draft.memory.is_nav_open = !draft.memory.is_nav_open
    })
  }, [set_state])

  return {
    on_nav_toggle
  }
}
