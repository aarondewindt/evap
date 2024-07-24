import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"
import { Location } from "@prisma/client"
import { CUDLocationsArgs } from "@/server_actions/locations/actions"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_location_id = (state: State) => state.props.location_id
    const sel_locations_query = (state: State) => state.injected.locations_query
    const sel_has_edit_permission = (state: State) => state.injected.has_edit_permission
    const sel_edit = (state: State) => state.memory.edit
    const sel_is_editing = (state: State) => state.memory.edit !== null

    const sel_is_fetching = createSelector(
      sel_locations_query,
      sel_has_edit_permission,
      (locations_query, has_edit_permission) => (locations_query?.isFetching ?? false) || (has_edit_permission === null) 
    )

    const sel_locations_query_args = createSelector(
      sel_location_id,
      (location_id) => ({ args: { where: { id: location_id } } })
    )

    const sel_location_from_query = createSelector(
      sel_locations_query,
      (locations_query) => locations_query?.data?.[0] ?? null
    )

    const sel_unedited_location = sel_location_from_query

    const sel_location = createSelector(
      sel_unedited_location,
      sel_edit, 
      (unedited_location, edit): Location | null => {
        if (!unedited_location) return null
        if (!edit) return unedited_location
        return edit
      }
    )

    const sel_save_args = createSelector(
      sel_edit,
      (edit): CUDLocationsArgs | null => {
        if (!edit) return null
        return {
          update: [{
            where: { id: edit.id },
            data: _.omit(edit, ['id'])
          }]
        }
      }
    )


    return {
      sel_is_fetching,
      sel_has_edit_permission,
      sel_locations_query_args,
      sel_location,
      sel_is_editing,
      sel_save_args,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

