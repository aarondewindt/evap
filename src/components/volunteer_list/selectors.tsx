import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"


export const useSelectors = () => {
  return useMemo(() => {
    
    const sel_all_volunteers_query = (state: State) => state.injected.all_volunteers
    const sel_cud_volunteers_mutation = (state: State) => state.injected.cud_volunteers_mutation
    const sel_has_edit_permission = (state: State) => true

    const sel_is_fetching = createSelector(
      sel_all_volunteers_query,
      sel_cud_volunteers_mutation,
      (all_volunteers, mutation) => all_volunteers?.isFetching || mutation?.isPending || false
    )

    const sel_all_volunteers = createSelector(
      sel_all_volunteers_query,
      (all_volunteers) => all_volunteers?.data || []
    )

    const sel_search_query = (state: State) => state.memory.search_query

    const sel_volunteers = createSelector(
      sel_all_volunteers,
      sel_search_query,
      (all_volunteers, search_query) => {
        if (!search_query) return all_volunteers
        return all_volunteers.filter((volunteer) => volunteer.name.includes(search_query))
      }
    )

    return {
      sel_is_fetching,
      sel_all_volunteers,
      sel_has_edit_permission,
      sel_volunteers,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

