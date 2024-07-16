import { use, useCallback, useEffect, useRef } from "react"
import { useSelectors } from "./selectors"
import { FormValues, State } from "./types"
import { Draft } from "immer"
import { modals } from '@mantine/modals';
import { useInject } from "./inject"
import { Text } from "@mantine/core";


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const ref = useRef({ state, s, a, set_state })
  useEffect(() => {
    ref.current = { state, s, a, set_state }
  }, [ state, s, a, set_state ])

  const on_enable_editing = useCallback(() => {
    set_state((draft) => {
      const form_values = s.sel_form_values(draft)
      if (!form_values) return

      draft.memory.form = {
        mode: "edit",
        values: form_values
      }
    })
  }, [ set_state, s ])

  const on_cancel_editing = useCallback(() => {
    set_state((draft) => {
      draft.memory.form = {
        mode: "view",
      }
    })
  }, [ set_state ])

  const on_save = useCallback(async () => {
    const mode = s.sel_mode(state)
    if (mode !== "edit") return

    const event_id = s.sel_event_id(state)
    if (!event_id) return

    const form_values = s.sel_form_values(state)    
    if (!form_values) return

    await a.update_events([{
      id: event_id,
      ...form_values
    }])

    ref.current.set_state((draft) => {
      draft.memory.form = {
        mode: "view"
      }
    })
  }, [ s, a, ref, state ])

  const on_create = useCallback(async () => {
    const form_values = s.sel_form_values(state)
    if (!form_values) return

    await a.create_events([ form_values ])

    ref.current.set_state((draft) => {
      draft.memory.form = {
        mode: "created"
      }
    })
  }, [ s, a, ref, state ])

  const on_change_form_value = useCallback(<T extends keyof FormValues,>(key: T, value: FormValues[T]) => { 
    set_state((draft) => {
      const edit_enabled = s.sel_edit_enabled(draft)
      if (!edit_enabled) return

      const form_values = s.sel_form_values(draft)
      if (!form_values) return

      const mode = s.sel_mode(draft)
      
      draft.memory.form = {
        mode,
        values: {
          ...form_values,
          [key]: value
        }
      }
    })
  }, [ set_state, s ])


  const on_delete_event = () => {
    modals.openConfirmModal({
      title: 'Delete event',
      children: <Text>Are you sure you want to delete this event?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        const event_id = s.sel_event_id(state)
        if (!event_id) return

        await a.delete_events([ event_id ])

        ref.current.set_state((draft) => {
          draft.memory.form = {
            mode: "deleted"
          }
        })
      }
    })
  }

  return {
    on_enable_editing,
    on_cancel_editing,
    on_change_form_value,
    on_save,
    on_create,
    on_delete_event
  }
}
