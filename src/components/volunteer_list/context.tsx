import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import {produce, Draft} from "immer"

import { init_memory, State, VolunteerListProviderProps } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useActions } from './actions';
import { useInject } from './inject';


export type Context = {
  state: State
} & ReturnType<typeof useActions> & SelectedValues


const VolunteerListContext = createContext<Context>({} as Context);

export const VolunteerListProvider = ({ children, ...props }: VolunteerListProviderProps) => {
  const [ memory, set_memory_value ] = useState(init_memory)

  const selectors = useSelectors()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, injected: {}
    }), [props, memory ]), 
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

  return <VolunteerListContext.Provider value={context}>
    {children}
  </VolunteerListContext.Provider>
}

export const useVolunteerListContext = () => {
  const context = useContext(VolunteerListContext);

  if (context === undefined) {
    throw new Error("useVolunteerListContext must be used within VolunteerListProvider");
  }

  return context;
};

