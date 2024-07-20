import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const router = useRouter()

  const { cud_volunteers } = a
  
  const on_new_volunteer = useCallback(async () => {
    const volunteer_name = window.prompt("Volunteer Name")
    if (!volunteer_name) return

    const { create } = await cud_volunteers({
      create: [{
        data: { name: volunteer_name, user_id: null, notes: "" }
      }]
    })

    const new_volunteer = create[0]
    if (new_volunteer) {
      router.push(`/volunteers/${new_volunteer.id}`)
    }

  }, [ cud_volunteers, router ])

  const on_search_query_change = useCallback((search_query: string) => { 
    set_state((draft) => {
      draft.memory.search_query = search_query
    })
  }, [ set_state ])

  return {
    on_new_volunteer,
    on_search_query_change
  }
}
