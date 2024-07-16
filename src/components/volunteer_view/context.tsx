import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { init_memory, State, VolunteerViewProviderProps } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useURLState } from '@/utils/use_url_state';
import { useActions } from './actions';
import { useInject } from './inject';


export type Context = {
  state: State
} & ReturnType<typeof useActions> & SelectedValues


const VolunteerViewContext = createContext<Context>({} as Context);

export const VolunteerViewProvider = ({ children, ...props }: VolunteerViewProviderProps) => {
  const [ memory, set_memory_value ] = useState(init_memory)

  const selectors = useSelectors()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, other: {}
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

  return <VolunteerViewContext.Provider value={context}>
    {children}
  </VolunteerViewContext.Provider>
}

export const useVolunteerViewContext = () => {
  const context = useContext(VolunteerViewContext);

  if (context === undefined) {
    throw new Error("useVolunteerViewContext must be used within VolunteerViewProvider");
  }

  return context;
};

