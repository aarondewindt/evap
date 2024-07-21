import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { BigCalendarEvent, State } from "./types"


export const useSelectors = <TEvent extends BigCalendarEvent>() => {
  return useMemo(() => {
    
    const sel_expand_height = (state: State<TEvent>) => state.props.expand_height
    const sel_current_date = (state: State<TEvent>) => state.memory.date
    const sel_current_view = (state: State<TEvent>) => state.memory.view
    const sel_selected = (state: State<TEvent>) => state.memory.selected

    const sel_calender_props = createSelector(
      sel_current_date,
      sel_current_view,
      sel_selected,
      (current_date, current_view, selected) => {
        return {
          date: current_date,
          view: current_view,
          selected
        }
      }
    )

    return {
      sel_expand_height,
      sel_calender_props
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors<TEvent extends BigCalendarEvent> = ReturnType<typeof useSelectors<TEvent>>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes<TEvent extends BigCalendarEvent> = GetSelectorsReturnTypes<Selectors<TEvent>>
export type SelectedValues<TEvent extends BigCalendarEvent> = { [K in (keyof Selectors<TEvent> extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors<TEvent>[`sel_${K}`]> }

