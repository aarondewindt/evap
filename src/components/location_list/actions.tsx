import { useCallback } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { useNProgress } from "@/utils/use_nprogress"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const on_new_location = useCallback(async () => {
    const name = window.prompt("Enter a new location name")
    if (!name) return

    await a.cud_locations({
      create: [{
        data: { 
          name,
          description: "",
          address: "",
          maps_url: "",
          notes: "",
        }
      }]
    })
  }, [ a ])

  const on_change_selected_location = useCallback((id: string | null) => {
    set_state((draft) => {
      draft.memory.selected_location_id = id
    })
  }, [ set_state ])  

  return {
    on_new_location,
    on_change_selected_location,
  }
}
