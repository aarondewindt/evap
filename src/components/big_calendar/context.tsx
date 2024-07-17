import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { BigCalendarProps, State, init_local_storage, local_storage_key } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useActions } from './actions';
import { useInject } from './inject';


export type UseBigCalendarStateReturnType<TEvent extends object, TResource extends object> = {
  state: State<TEvent, TResource>
} & ReturnType<typeof useActions> & SelectedValues<TEvent, TResource>


export const useBigCalendarContext = <TEvent extends object, TResource extends object>
                                   (props: BigCalendarProps<TEvent, TResource>) => {
  
  const init_state: State<TEvent, TResource> = {
    props,
    memory: { foo: 0 },
    local_storage: init_local_storage,
    injected: {}
  }                                  

  const [ memory, set_memory_value ] = useState(init_state.memory)
  const [ _local_storage, set_persistent_value ] = useLocalStorage({ key: local_storage_key, defaultValue: init_local_storage})  
  const local_storage = _local_storage ?? init_local_storage

  const selectors = useSelectors<TEvent, TResource>()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, local_storage, injected: {}
    }), [ props, memory, local_storage ]), 
    selectors
  )

  const set_state = useCallback((recipe: (draft: Draft<State<TEvent, TResource>>)=>void) => {
    const new_state = produce(state, recipe)   
    set_memory_value(new_state.memory)   
    set_persistent_value(new_state.local_storage)
  }, [set_persistent_value, set_memory_value, state])

  const actions = useActions<TEvent, TResource>(state, selectors, injected_actions, set_state)
  const selected: SelectedValues<TEvent, TResource> = Object.fromEntries(Object.entries(selectors)
    .map(([key, selector]): [string, any] => [key.slice(4), selector(state)])) as SelectedValues<TEvent, TResource>

  return {
    state,
    ...selected,
    ...actions
  }
}
