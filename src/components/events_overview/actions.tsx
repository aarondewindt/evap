import { useCallback, useEffect, useRef } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { View, Event as RbcEvent } from "react-big-calendar"
import { modals } from "@mantine/modals"
import { Text } from "@mantine/core"
import { useRouter } from "next/navigation"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const ref = useRef({ state, s, a, set_state })
  useEffect(() => { ref.current = { state, s, a, set_state } }, [ state, s, a, set_state ])
  const router = useRouter()

  const on_enable_editing = useCallback(() => {
    set_state((draft) => {
      if (draft.memory.edit) return
      draft.memory.edit = { 
        new_events: [],
        updated_events: [],
        deleted_event_ids: []
      }
    })
  }, [ set_state ])

  const on_cancel_editing = useCallback(() => {
    set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ set_state ])

  const on_save = useCallback(async () => {
    const is_editing = s.sel_is_editing(state)
    if (!is_editing) return

    const cud_args = s.sel_on_save_args(state)

    if (cud_args) {
      await a.cud_events_async(cud_args)
    }

    ref.current.set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ s, a, state ])

  const on_calendar_navigate = useCallback((date: Date) => {
    set_state((draft) => {
      draft.local_storage.calendar_settings.date = date
    })
  }, [ set_state ])

  const on_calendar_view_change = useCallback((view: View) => {
    set_state((draft) => {
      draft.local_storage.calendar_settings.view = view
    })
  }, [ set_state ])

  const on_calender_select_event = useCallback((event: RbcEvent) => {
    set_state((draft) => {
      draft.memory.selected_event_id = event.resource.id
    })
  }, [ set_state ])

  const on_calender_select_slot = useCallback((slot_info: { start: Date, end: Date }) => {
    set_state((draft) => {
      draft.memory.edit!.new_events.push({
        id: `new_${Date.now()}`,
        start_datetime: slot_info.start,
        end_datetime: slot_info.end,
        name: "New Event",
        description: "",
        notes: "",
        location_id: null
      })
    })
  }, [ set_state ])

  const on_calendar_double_click = useCallback((event: RbcEvent) => {
    if (!state.memory.edit) {
      router.push(`/events/${event.resource.id}`)
      return
    }
    
    modals.openConfirmModal({
      title: 'Delete event',
      children: <Text>Are you sure you want to delete &apos;{event.title}&apos;?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        set_state((draft) => {
          if (!draft.memory.edit) return
          const event_id = event.resource.id
          if (event_id.startsWith("new_")) {
            draft.memory.edit.new_events = draft.memory.edit.new_events.filter((e) => e.id !== event_id)
          } else {
            draft.memory.edit.updated_events = draft.memory.edit.updated_events.filter((e) => e.id !== event_id)
            draft.memory.edit.deleted_event_ids.push(event.resource.id)
          }
        })
      }
    })    
  }, [ set_state, state ])


  const on_calendar_event_edit = useCallback(({ event, start, end }: { event: RbcEvent, start: string | Date, end: string | Date }) => {
    if (!state.memory.edit) return
    set_state((draft) => {
      if (!draft.memory.edit) return
      const event_id = event.resource.id

      const event_list = event_id.startsWith("new_") ? draft.memory.edit.new_events : draft.memory.edit.updated_events
      const updated_event = event_list.find((e) => e.id === event_id)
      start = new Date(start)
      end = new Date(end)
      if (updated_event) {
        updated_event.start_datetime = start
        updated_event.end_datetime = end
      } else {
        const actual_events = s.sel_events(draft)
        const actual_event = actual_events.find((e) => e.id === event_id)
        if (!actual_event) return
        draft.memory.edit.updated_events.push({
          ...actual_event,
          start_datetime: start,
          end_datetime: end
        })
      }
    })
  }, [ set_state, state, s ])


  return {
    on_enable_editing,
    on_cancel_editing,
    on_calendar_navigate,
    on_calendar_view_change,
    on_calender_select_event,
    on_calender_select_slot,
    on_calendar_double_click,
    on_calendar_event_edit,
    on_save,
  }
}
