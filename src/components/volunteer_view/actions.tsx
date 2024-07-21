import { use, useCallback, useEffect, useRef } from "react"
import { useSelectors } from "./selectors"
import { State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { View, Event as RbcEvent } from "react-big-calendar"


export const useActions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      a: ReturnType<typeof useInject>['injected_actions'],
      set_state: (recipe: (draft: Draft<State>)=>void)=>void) => {
  
  const { cud_volunteers } = a

  const ref = useRef({ set_state })
  useEffect(() => { ref.current = { set_state } }, [ set_state ])

  // const ref = useRef({ state, s, a, set_state })
  // useEffect(() => { ref.current = { state, s, a, set_state } }, [ state, s, a, set_state ])

  const on_enable_editing = useCallback(() => {
    set_state((draft) => {
      const volunteer = s.sel_volunteer(draft)
      if (!volunteer) return
      draft.memory.edit = {
        volunteer,
        new_availability_slots: [],
        updated_availability_slots: [],
        deleted_availability_slots: []
      }
    })
  }, [ set_state, s ])

  const on_cancel_editing = useCallback(() => {
    set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ set_state ])

  const on_save = useCallback(async () => {
    const is_editing = s.sel_is_editing(state)
    if (!is_editing) return

    const volunteer = {...s.sel_volunteer(state)}
    if (!volunteer) return
    
    const update_args = s.sel_on_save_args(state)
    if (update_args) {
      await cud_volunteers(update_args)
    }

    ref.current.set_state((draft) => {
      draft.memory.edit = null
    })
  }, [ s, cud_volunteers, state ])

  const on_name_change = useCallback((value: string) => {
    set_state((draft) => {
      const is_editing = s.sel_is_editing(draft)
      if (!is_editing) return
      draft.memory.edit!.volunteer.name = value
    })
  }, [ set_state, s ])

  const on_notes_change = useCallback((value: string) => {
    set_state((draft) => {
      const is_editing = s.sel_is_editing(draft)
      if (!is_editing) return
      draft.memory.edit!.volunteer.notes = value
    })
  }, [ set_state, s ])

  // Availabilty slots calendar
  const on_calendar_navidate = useCallback((date: Date) => {
    set_state((draft) => {
      draft.memory.calendar_date = date
    })
  }, [ set_state])

  const on_calendar_view_change = useCallback((view: View) => {
    set_state((draft) => {
      draft.memory.calendar_view = view
    })
  }, [ set_state])

  const on_calender_select_event = useCallback((calendar_event: RbcEvent) => {
    console.log("on_calender_select_event", calendar_event)
    set_state((draft) => {
      draft.memory.selected_slot_id = calendar_event.resource.id as string
    })
  }, [ set_state ])

  const on_calender_select_slot = useCallback(({ start, end }: { start: Date, end: Date }) => {
    set_state((draft) => {
      if (!draft.memory.edit) return
      
      draft.memory.edit.new_availability_slots.push({
        id: `new_${start.toISOString()}`,
        volunteer_id: draft.memory.edit.volunteer.id,
        start_datetime: start,
        end_datetime: end
      })
    })
  }, [ set_state ])

  const on_calendar_double_click = useCallback((calendar_event: RbcEvent) => {
    console.log("on_calendar_double_click", calendar_event)
    set_state((draft) => {
      if (!draft.memory.edit) return
      const slot_id = calendar_event.resource.id as string
      if (slot_id.startsWith("new_")) {
        draft.memory.edit.new_availability_slots = draft.memory.edit.new_availability_slots.filter((s) => s.id !== slot_id)
      } else {
        draft.memory.edit.deleted_availability_slots.push(slot_id)
      }
    })
  }, [ set_state ])

  const on_calendar_event_edit = useCallback(({ event, start, end}: { event: RbcEvent, start: string | Date, end: string | Date }) => {
    set_state((draft) => {
      if (!draft.memory.edit) return
      const slot_id = event.resource.id as string

      const slot_list = slot_id.startsWith("new_") ? draft.memory.edit.new_availability_slots : draft.memory.edit.updated_availability_slots
      const slot = slot_list.find((s) => s.id === slot_id)
      start = new Date(start)
      end = new Date(end)
      if (slot) {
        slot.start_datetime = start
        slot.end_datetime = end
      } else {
        draft.memory.edit.updated_availability_slots.push({
          id: slot_id,
          volunteer_id: draft.memory.edit.volunteer.id,
          start_datetime: start,
          end_datetime: end
        })
      }
    })
  }, [ set_state ])

  const on_global_volunteer_settings_loaded = useCallback(() => {
    set_state((draft) => {
      draft.memory.calendar_date = draft.injected.global_volunteer_settings?.data?.default_calendar_date ?? draft.memory.calendar_date
      draft.memory.calendar_view = draft.injected.global_volunteer_settings?.data?.default_calendar_view ?? draft.memory.calendar_view
    })
  }, [ set_state ])

  return {
    on_enable_editing,
    on_cancel_editing,
    on_name_change,
    on_notes_change,
    on_save,

    on_calendar_navidate,
    on_calendar_view_change,
    on_calender_select_event,
    on_calender_select_slot,
    on_calendar_double_click,
    on_calendar_event_edit,
    on_global_volunteer_settings_loaded,
    on_help_msg_shown: () => a.set_help_msg_shown_before(true),
  }
}
