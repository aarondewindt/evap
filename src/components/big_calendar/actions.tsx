import { SyntheticEvent, useCallback } from "react"
import { useSelectors } from "./selectors"
import { BigCalendarEvent, State } from "./types"
import { Draft } from "immer"
import { useInject } from "./inject"
import { View } from "react-big-calendar"


export const useActions = <TEvent extends BigCalendarEvent>(
      state: State<TEvent>,
      s: ReturnType<typeof useSelectors<TEvent>>,
      a: ReturnType<typeof useInject<TEvent>>['injected_actions'],
      set_state: (recipe: (draft: Draft<State<TEvent>>)=>void)=>void) => {
  
  const on_calendar_navigate = useCallback((date: Date) => {
    set_state((draft) => {
      draft.memory.date = date
    })
  }, [ set_state ])

  const on_calendar_view_change = useCallback((view: View) => {
    set_state((draft) => {
      draft.memory.view = view
    })
  }, [ set_state ])

  const on_selecting = useCallback((event: TEvent | null) => {
    set_state((draft) => {
      draft.memory.selected = event as Draft<TEvent>
    })
  }, [ set_state ])

  const on_key_press_event = useCallback((event: TEvent, e: SyntheticEvent<HTMLElement, Event>) => {
    if (e.type === "keydown") {
      switch ((e as unknown as KeyboardEvent).key) {
        case "Delete":
          if (state.props.onEventDelete) {
            state.props.onEventDelete?.(event)
            return
          }
        default:
          break
      }
    }

    state.props.calendar_props?.onKeyPressEvent?.(event, e)

  }, [ state.props ])

  return {
    on_calendar_navigate,
    on_calendar_view_change,
    on_selecting,
    on_key_press_event
  }
}
