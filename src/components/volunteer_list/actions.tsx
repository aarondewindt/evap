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
  
  const { create_volunteers } = a
  
  const on_new_volunteer = useCallback(() => {
    create_volunteers([{ name: "New Volunteer", user_id: null, notes: "" }])
  }, [ create_volunteers ])

  return {
    on_new_volunteer
  }
}
