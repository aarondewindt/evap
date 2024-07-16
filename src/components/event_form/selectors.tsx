import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import { default_form_values, FormValues, type FormState, type State } from "./types"
import { TextInputProps } from "@mantine/core"
import { DateTimePickerProps } from "@mantine/dates"
import { RichTextProps } from "../rich_text"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_event_id = (state: State) => state.props.event_id ?? null
    const sel_form_state = (state: State) => state.memory.form
    const sel_editable = (state: State) => state.props.editable ?? false

    const sel_query_events_args = createSelector(
      sel_event_id,
      (event_id) => event_id ? [event_id] : []
    )

    const sel_query_events = ({ queries }: State) => queries.events

    const sel_is_fetching = createSelector(
      sel_query_events,
      (events) => events?.isFetching ?? false
    )

    const sel_event = createSelector(
      sel_query_events,
      (events) => {
        if (!events?.isSuccess) return
        return events?.data?.[0] ?? null
      }
      
    )

    const sel_mode = createSelector(
      sel_event_id,
      sel_form_state,
      (event_id, form_state): FormState["mode"] => {
        if (!event_id) return form_state.mode === "created" ? "created" : "create"
        return form_state.mode
      }
    )

    const sel_edit_enabled = createSelector(
      sel_editable,
      sel_event_id,
      sel_form_state,
      (editable, event_id, form_state) => {
        if (!editable) return false
        if (!event_id && (form_state.mode !== "created")) return true
        return form_state.mode === "edit"
      }
    )

    const sel_form_values = createSelector(
      sel_event_id,
      sel_event,
      sel_form_state,
      (event_id, event, form_state): FormValues | null => {
        console.log("sel_form_values", event_id, event, form_state)
        if ((!event_id) && (form_state.mode !== "create")) {
          return {
            ...default_form_values,
            start_datetime: new Date(),
            end_datetime: new Date()
          }
        }

        if ((form_state.mode === "edit") || (form_state.mode === "create")) {
          return form_state.values

        } else if (form_state.mode === "created") {
          return null
        }
        
        if (!event) return null
        return _.pick(event, Object.keys(default_form_values)) as FormValues
      }
    )

    const sel_name_input_props = createSelector(
      sel_form_values,
      sel_mode,
      (form_values, mode): TextInputProps => {
        if (!form_values) return { readOnly: true }
        return {
          value: form_values.name,
          readOnly: mode === "view"
        }
      }
    )

    const sel_description_input_props = createSelector(
      sel_form_values,
      sel_mode,
      (form_values, mode): TextInputProps => {
        if (!form_values) return { readOnly: true }
        return {
          value: form_values.description,
          readOnly: mode === "view"
        }
      }
    )

    const sel_start_date_time_picker_props = createSelector(
      sel_form_values,
      sel_mode,
      (form_values, mode): DateTimePickerProps => {
        if (!form_values) return { readOnly: true }
        return {
          value: form_values.start_datetime,
          readOnly: mode === "view"
        }
      }
    )

    const sel_end_date_time_picker_props = createSelector(
      sel_form_values,
      sel_mode,
      (form_values, mode): DateTimePickerProps => {
        if (!form_values) return { readOnly: true }
        return {
          value: form_values.end_datetime,
          readOnly: mode === "view"
        }
      }
    )

    const sel_notes_props = createSelector(
      sel_form_values,
      sel_mode,
      (form_values, mode): RichTextProps => {
        if (!form_values) return { value: "" }
        return {
          value: form_values.notes,
          editor_enabled: mode !== "view"
        }
      }
    )

    return {
      sel_event_id,
      sel_form_state,
      sel_query_events_args,
      sel_is_fetching,
      sel_form_values,
      sel_mode,
      sel_name_input_props,
      sel_description_input_props,
      sel_start_date_time_picker_props,
      sel_end_date_time_picker_props,
      sel_notes_props,
      sel_editable,
      sel_edit_enabled,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

