"use client"

import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { init_memory, State, GlobalStateProviderProps, init_local_storage, local_storage_key, init_url, url_key } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useURLState } from '@/utils/use_url_state';
import { useActions } from './actions';
import { useInject } from './inject';


export type Context = {
  state: State
} & ReturnType<typeof useActions> & SelectedValues


const GlobalStateContext = createContext<Context>({} as Context);

export const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const [ memory, set_memory_value ] = useState(init_memory)
  const [ url, set_url_value ] = useURLState(url_key, init_url)
  const [ _local_storage, set_persistent_value ] = useLocalStorage({ key: local_storage_key, defaultValue: init_local_storage})  
  const local_storage = _local_storage ?? init_local_storage

  const selectors = useSelectors()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      memory, local_storage, url, queries: {}, mutations: {}, other: {}
    }), [memory, local_storage, url ]), 
    selectors
  )

  const set_state = useCallback((recipe: (draft: Draft<State>)=>void) => {
    const new_state = produce(state, recipe)   
    set_memory_value(new_state.memory)   
    set_persistent_value(new_state.local_storage)
    set_url_value(new_state.url)
  }, [set_persistent_value, set_memory_value, set_url_value, state])

  const actions = useActions(state, selectors, injected_actions, set_state)
  const selected: SelectedValues = Object.fromEntries(Object.entries(selectors)
    .map(([key, selector]): [string, any] => [key.slice(4), selector(state)])) as SelectedValues

  const context: Context = {
    state,
    ...selected,
    ...actions
  }

  return <GlobalStateContext.Provider value={context}>
    {children}
  </GlobalStateContext.Provider>
}

export const useGlobalStateContext = () => {
  const context = useContext(GlobalStateContext);

  if (context === undefined) {
    throw new Error("useGlobalStateContext must be used within GlobalStateProvider");
  }

  return context;
};

