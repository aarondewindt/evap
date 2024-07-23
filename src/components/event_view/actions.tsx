import { useCallback, useEffect, useRef } from "react"
import { useSelectors } from "./selectors"
import { EventInfo, State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const ref = useRef({ state, s, a, set_state })
  useEffect(() => {
    ref.current = { state, s, a, set_state }
  }, [ state, s, a, set_state ])

  const on_change_event_value = useCallback(<T extends keyof EventInfo,>(key: T, value: EventInfo[T]) => {
    set_state((draft) => {
      if (!draft.memory.edit) return
      draft.memory.edit.event[key] = value
    })
  }, [ set_state ])

  const on_enable_editing = useCallback(() => {
    set_state((draft) => {
      const current_event = s.sel_event(draft)
      if (!current_event) return
      draft.memory.edit = {
        event: current_event
      }
    })
  }, [ set_state, s ])

  const on_cancel_editing = useCallback(() => {
    set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ set_state ])

  const on_save = useCallback(async () => {
    const args = s.sel_update_events_args(state)
    if (!args) return

    await a.cud_events(args)

    ref.current.set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ s, a, state ])

  return {
    on_change_event_value,
    on_enable_editing,
    on_cancel_editing,
    on_save
  }
}
