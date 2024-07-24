import { use, useCallback, useEffect, useRef } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { Location } from "@prisma/client"
import _ from "lodash"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const ref = useRef({ set_state })
  useEffect(() => {
    ref.current = { set_state }
  }, [ set_state ])

  const on_location_field_change = useCallback(<K extends keyof Location,>(key: K, value: Location[K]) => {
    set_state((draft) => {
      if (!draft.memory.edit) return
      draft.memory.edit[key] = value
    })
  }, [set_state])

  const on_enable_editing = useCallback(() => {
    set_state((draft) => {
      if (draft.memory.edit) return
      const location = s.sel_location(draft)
      draft.memory.edit = _.cloneDeep(location)
    })
  }, [ set_state, s])

  const on_save = useCallback(async () => {
    const save_args = s.sel_save_args(state)
    if (!save_args) return
    await a.cud_locations(save_args)
    ref.current.set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ s, a, state ])

  const on_cancel_editing = useCallback(() => {
    set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ set_state ])


  return {
    on_location_field_change,
    on_enable_editing,
    on_save,
    on_cancel_editing,
  }
}
