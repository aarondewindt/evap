import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"


export const useSelectors = () => {
  return useMemo(() => {
    
    const sel_all_volunteers_query = (state: State) => state.server_actions.all_volunteers
    const sel_has_edit_permission = (state: State) => state.server_actions.has_edit_permission

    const sel_is_fetching = createSelector(
      sel_all_volunteers_query,
      (all_volunteers) => all_volunteers?.isFetching || false
    )

    const sel_all_volunteers = createSelector(
      sel_all_volunteers_query,
      (all_volunteers) => all_volunteers?.data || []
    )

    return {
      sel_is_fetching,
      sel_all_volunteers,
      sel_has_edit_permission
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

