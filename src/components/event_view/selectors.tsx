import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import { event_get_payload, EventInfo, type State } from "./types"
import { TextInputProps } from "@mantine/core"
import { DateTimePickerProps } from "@mantine/dates"
import { RichTextProps } from "../rich_text"
// import { EventFindManyArgs } from "@/server_actions/events/actions"
import { prisma } from "@/db"


export type EventFindManyArgs = Parameters<typeof prisma.event.findMany<typeof event_get_payload>>[0]


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_events_query_args = (state: State): EventFindManyArgs => ({
      where: { id: state.props.event_id },
      ...event_get_payload
    })

    const sel_events_query = (state: State) => state.injected.events_query

    const sel_event_from_query = createSelector(
      sel_events_query,
      // TODO: Make useFindManyEvents generic to get rid of this cast
      (query): EventInfo | null => (query?.data?.[0] as EventInfo) ?? null  
    )

    const sel_unedited_event = sel_event_from_query

    const sel_is_editing = (state: State) => !!state.memory.edit
    const sel_edit = (state: State) => state.memory.edit

    const sel_form_values = createSelector(
      sel_unedited_event,
      sel_edit,
      (unedited_event, edit): Partial<EventInfo> => {
        if (!edit) return {}
       
        return _.pick(edit.event, ["name", "description", "start_date", "end_date", "notes"])
      }
    )

    const sel_name_input_props = createSelector(
      sel_form_values,
      (form_values): TextInputProps => ({})
    )

    const sel_description_input_props = createSelector(
      sel_form_values,
      (form_values): TextInputProps => ({})
    )

    const sel_start_date_time_picker_props = createSelector(
      sel_form_values,
      (form_values): DateTimePickerProps => ({})
    )

    const sel_end_date_time_picker_props = createSelector(
      sel_form_values,
      (form_values): DateTimePickerProps => ({})
    )

    const sel_notes_props = createSelector(
      sel_form_values,
      (form_values): RichTextProps => ({})
    )

    return {
      sel_name_input_props,
      sel_description_input_props,
      sel_start_date_time_picker_props,
      sel_end_date_time_picker_props,
      sel_notes_props,
      sel_events_query_args,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

