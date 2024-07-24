import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { init_memory, State, LocationListProviderProps } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useActions } from './actions';
import { useInject } from './inject';


export type Context = {
  state: State
} & ReturnType<typeof useActions> & SelectedValues


const LocationListContext = createContext<Context>({} as Context);

export const LocationListProvider = ({ children, ...props }: LocationListProviderProps) => {
  const [ memory, set_memory_value ] = useState(init_memory)

  const selectors = useSelectors()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, injected: {}
    }), [ props, memory ]), 
    selectors
  )

  const set_state = useCallback((recipe: (draft: Draft<State>)=>void) => {
    const new_state = produce(state, recipe)   
    set_memory_value(new_state.memory)
  }, [ set_memory_value, state])

  const actions = useActions(state, selectors, injected_actions, set_state)
  const selected: SelectedValues = Object.fromEntries(Object.entries(selectors)
    .map(([key, selector]): [string, any] => [key.slice(4), selector(state)])) as SelectedValues

  const context: Context = {
    state,
    ...selected,
    ...actions
  }

  return <LocationListContext.Provider value={context}>
    {children}
  </LocationListContext.Provider>
}

export const useLocationListContext = () => {
  const context = useContext(LocationListContext);

  if (context === undefined) {
    throw new Error("useLocationListContext must be used within LocationListProvider");
  }

  return context;
};

