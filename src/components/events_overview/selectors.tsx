import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"
import { CalendarProps } from "react-big-calendar"
import { CUDEventsArgs } from "@/server_actions/events/actions"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_edit = (state: State) => state.memory.edit
    const sel_query_events = (state: State) => state.injected?.events_query?.data ?? []
    const sel_is_editing = (state: State) => !!state.memory.edit
    const sel_calendar_settings = (state: State) => state.local_storage.calendar_settings
    const sel_selected_event_id = (state: State) => state.memory.selected_event_id
    const sel_has_edit_permission = (state: State) => state.injected?.has_edit_permission ?? false
    
    const sel_events = createSelector(
      sel_edit,
      sel_query_events,
      (edit, query_events) => {
        if (!edit) return query_events

        return query_events
          .map((event) => {
            const updated_event = edit.updated_events.find((e) => e.id === event.id)
            return updated_event || event
          })
          .filter((event) => !edit.deleted_event_ids.includes(event.id))
          .concat(edit.new_events)
      }
    )

    const sel_calendar_events = createSelector(
      sel_events,
      (events) => {
        return events.map((event) => {
          return {
            id: event.id,
            title: event.name,
            start: event.start_datetime,
            end: event.end_datetime,
            resource: event
          }
        })
      }
    )

    const sel_calender_props = createSelector(
      sel_is_editing,
      sel_calendar_events,
      sel_calendar_settings,
      sel_selected_event_id,
      (is_editing, events, settings, selected_event_id) => {
        const selected = events.find((e) => e.id === selected_event_id)
        return {
          events,
          view: settings.view,
          date: settings.date,
          selectable: is_editing,
          resizable: is_editing,
          selected
      }}
    )

    const sel_on_save_args = createSelector(
      sel_edit,
      sel_query_events,
      (edit): CUDEventsArgs | null => {
        if (!edit) return null

        return {
          create_many: [{ 
            data: edit.new_events.map((e) => _.omit(e, "id")),
            skipDuplicates: true
          }],
          update: edit.updated_events.map((e) => ({ where: { id: e.id }, data: _.omit(e, "id") })),
          delete_many: [{ where: { id: { in: edit.deleted_event_ids } } }]
        }
    })

    return {
      sel_events,
      sel_is_editing,
      sel_calender_props,
      sel_has_edit_permission,
      sel_on_save_args,
      sel_selected_event_id,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

