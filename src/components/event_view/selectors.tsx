import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"
import { TextInputProps } from "@mantine/core"
import { DateTimePickerProps } from "@mantine/dates"
import { RichTextProps } from "../rich_text"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_form_values = (state: State) => {}

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

    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

