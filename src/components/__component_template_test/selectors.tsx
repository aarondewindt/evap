import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"
import type {  } from "types/dc_data_models"


export const useSelectors = () => {
  return useMemo(() => {
    const sel_counter_a = ({memory}: State) => memory.counter_a
    const sel_counter_b = ({persistent}: State) => persistent.counter_b
    const sel_counter_c = ({url_params}: State) => url_params.counter_c

    const sel_counter_sum = createSelector(
      sel_counter_a,
      sel_counter_b,
      sel_counter_c,
      (counter_a, counter_b, counter_c) => counter_a + counter_b + counter_c
    )

    return {
      sel_counter_a,
      sel_counter_b,
      sel_counter_c,
      sel_counter_sum,
    }
  }, [])
}


type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes = GetSelectorsReturnTypes<ReturnType<typeof useSelectors>>
