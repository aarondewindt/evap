import { useCallback, useEffect, useRef } from "react"
import { useSelectors } from "./selectors"
import { ActivityCEvent, EventInfo, State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { modals } from "@mantine/modals"
import { Text } from "@mantine/core"


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
        event: current_event,
        activities: {
          new: [],
          updated: [],
          deleted: []
        }
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


  // Activities calendar
  // on_activity_calender_select_event
  const on_activity_calender_select_slot = useCallback((slot_info: { start: Date, end: Date }) => {
    set_state((draft) => {
      if (!draft.memory.edit) return

      const name = window.prompt("New Activity Name")
      if (!name) return

      draft.memory.edit.activities.new.push({
        id: `new_${Date.now()}`,
        event_id: draft.memory.edit.event.id,
        name,
        description: "",
        start_datetime: slot_info.start,
        end_datetime: slot_info.end,
        notes: "",
        location_id: null,        
      })
    })
  }, [ set_state ])
  
  const on_activity_calendar_delete = useCallback((event: ActivityCEvent) => {
    modals.openConfirmModal({
      title: 'Delete activity?',
      children: <Text>Are you sure you want to delete &apos;{event.title}&apos;?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        set_state((draft) => {
          if (!draft.memory.edit) return
          const resource = event.resource
          if (!("id" in resource)) return
          const activity = draft.memory.edit.activities.new.find((a) => a.id === resource.id)
          if (activity) {
            draft.memory.edit.activities.new = draft.memory.edit.activities.new.filter((a) => a.id !== resource.id)
          } else {
            draft.memory.edit.activities.deleted.push(resource.id)
          }
        })
      }
    })    
  }, [ set_state ])

  const on_activity_calendar_event_edit = useCallback(({ event, start, end }: { event: ActivityCEvent, start: string | Date, end: string | Date }) => {
    set_state((draft) => {
      if (!draft.memory.edit) return
      const resource = event.resource
      if (!("id" in resource)) return
      const activity_id = resource.id

      const edit_activities = activity_id.startsWith("new_") ? draft.memory.edit.activities.new : draft.memory.edit.activities.updated
      const updated_activity = edit_activities.find((e) => e.id === activity_id)

      if (updated_activity) {
        updated_activity.start_datetime = new Date(start)
        updated_activity.end_datetime = new Date(end)
      } else {
        const activities = s.sel_activities(draft)
        const activity = activities.find((e) => e.id === activity_id)
        if (!activity) return
        draft.memory.edit.activities.updated.push({
          ...activity,
          start_datetime: new Date(start),
          end_datetime: new Date(end)
        })
      }
    })

  }, [ set_state, s ])
  


  // on_activity_calendar_event_edit
  // on_activity_calendar_navigate
  // on_activity_calendar_view_change

  return {
    on_change_event_value,
    on_enable_editing,
    on_cancel_editing,
    on_save,
    on_close: state.props.onClose,

    on_activity_calender_select_slot,
    on_activity_calendar_delete,
    on_activity_calendar_event_edit
  }
}
