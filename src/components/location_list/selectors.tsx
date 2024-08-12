import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_locations_query = (state: State) => state.injected.locations_query
    const sel_has_edit_permission = (state: State) => state.injected.has_edit_permission
    const sel_search_query = (state: State) => state.memory.search_query
    const sel_selected_location_id = (state: State) => state.memory.selected_location_id
    
    const sel_is_fetching = createSelector(
      sel_locations_query,
      sel_has_edit_permission,
      (locations_query, has_edit_permission) => (locations_query?.isFetching ?? false) || (has_edit_permission === null) 
    )

    const sel_all_locations = createSelector(
      sel_locations_query,
      (locations_query) => locations_query?.data ?? null
    )

    const sel_locations = createSelector(
      sel_all_locations,
      sel_search_query,
      (locations, search_query) => {
        if (!locations) return null
        if (search_query == "") return locations
        return _.filter(locations, (location) => location.name.toLowerCase().includes(search_query.toLowerCase()))
      }
    )

    const sel_selected_location = createSelector(
      sel_all_locations,
      sel_selected_location_id,
      (locations, selected_location_id) => {
        if (!locations || !selected_location_id) return null
        return _.find(locations, (location) => location.id === selected_location_id) ?? null
      }
    )
 
    return {
      sel_is_fetching,
      sel_locations,
      sel_has_edit_permission,
      sel_selected_location_id,
      sel_selected_location,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

