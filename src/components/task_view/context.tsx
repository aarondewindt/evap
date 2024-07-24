import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { init_memory, State, TaskViewProviderProps } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useActions } from './actions';
import { useInject } from './inject';


export type Context = {
  state: State
} & ReturnType<typeof useActions> & SelectedValues


const TaskViewContext = createContext<Context>({} as Context);

export const TaskViewProvider = ({ children, ...props }: TaskViewProviderProps) => {
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

  return <TaskViewContext.Provider value={context}>
    {children}
  </TaskViewContext.Provider>
}

export const useTaskViewContext = () => {
  const context = useContext(TaskViewContext);

  if (context === undefined) {
    throw new Error("useTaskViewContext must be used within TaskViewProvider");
  }

  return context;
};

