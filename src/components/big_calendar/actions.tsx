import { useCallback } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"


export const useActions = <TEvent extends object, TResource extends object>(
      state: State<TEvent, TResource>,
      s: ReturnType<typeof useSelectors<TEvent, TResource>>,
      a: ReturnType<typeof useInject<TEvent, TResource>>['injected_actions'],
      set_state: (recipe: (draft: Draft<State<TEvent, TResource>>)=>void)=>void) => {
  
  const on_something = useCallback(() => {
    set_state((draft) => {
      draft.memory.foo = 1
    })
  }, [set_state])

  return {
    on_something
  }
}
