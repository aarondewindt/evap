import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"


export const useSelectors = ()=> {
  return useMemo(() => {
    
    const sel_is_nav_open = (state: State) => state.memory.is_nav_open
    const sel_is_aside_open = (state: State) => state.memory.is_aside_open
    const sel_is_mobile_screen = (state: State) => state.injected.is_mobile_screen

    const sel_session_query = (state: State) => state.injected.session
    const sel_session = createSelector(sel_session_query, (query) => query?.data ?? null)
    const sel_is_session_fetching = createSelector(sel_session_query, (query) => query?.isFetching ?? false)

    const sel_user_is_volunteer = createSelector(
      sel_session,
      (session): boolean => !session?.authenticated
    )

    const sel_path_name = (state: State) => state.injected.path_name
    const sel_search_params = (state: State) => state.injected.path_name

    return {
      sel_is_nav_open,
      sel_is_aside_open,
      sel_is_mobile_screen,
      sel_session,
      sel_user_is_volunteer,
      sel_is_session_fetching,
      sel_path_name,
      sel_search_params,
    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors = ReturnType<typeof useSelectors>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<Selectors>
export type SelectedValues = { [K in (keyof Selectors extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors[`sel_${K}`]> }

