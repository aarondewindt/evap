import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"


export const useSelectors = <TEvent extends object, TResource extends object>() => {
  return useMemo(() => {
    
    const sel_expand_height = (state: State<TEvent, TResource>) => state.props.expand_height
    const sel_props_calender_props = (state: State<TEvent, TResource>) => state.props.calendar_props
    const sel_current_date = (state: State<TEvent, TResource>) => state.memory.date
    const sel_current_view = (state: State<TEvent, TResource>) => state.memory.view

    const sel_calender_props = createSelector(
      sel_current_date,
      sel_current_view,
      (current_date, current_view) => {
        return {
          date: current_date,
          view: current_view
        }
      }
    )

    return {
      sel_expand_height,
      sel_calender_props
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors<TEvent extends object, TResource extends object> = ReturnType<typeof useSelectors<TEvent, TResource>>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes<TEvent extends object, TResource extends object> = GetSelectorsReturnTypes<Selectors<TEvent, TResource>>
export type SelectedValues<TEvent extends object, TResource extends object> = { [K in (keyof Selectors<TEvent, TResource> extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors<TEvent, TResource>[`sel_${K}`]> }

