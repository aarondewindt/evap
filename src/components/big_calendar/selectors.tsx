import _ from "lodash"
import { useMemo } from "react"
import { createSelector } from 'reselect'

import type { State } from "./types"


export const useSelectors = <TEvent extends object, TResource extends object>() => {
  return useMemo(() => {
    
    const sel_example = (state: State<TEvent, TResource>): number => { 
      return 23423
    }

    const sel_example2 = (state: State<TEvent, TResource>): number => 4234

    return {
      sel_example,
      sel_example2,

    } satisfies {[key: `sel_${string}`]: CallableFunction }
  }, [])
}

export type Selectors<TEvent extends object, TResource extends object> = ReturnType<typeof useSelectors<TEvent, TResource>>
type GetSelectorsReturnTypes<T extends Record<string, (...args: any) => any>> = { [K in keyof T]: ReturnType<T[K]> }
export type SelectorsReturnTypes<TEvent extends object, TResource extends object> = GetSelectorsReturnTypes<Selectors<TEvent, TResource>>
export type SelectedValues<TEvent extends object, TResource extends object> = { [K in (keyof Selectors<TEvent, TResource> extends `sel_${infer U}` ? U : never)]: ReturnType<Selectors<TEvent, TResource>[`sel_${K}`]> }

