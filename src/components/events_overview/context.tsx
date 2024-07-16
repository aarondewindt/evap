import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { init_memory, State, EventsOverviewProviderProps, init_local_storage } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useURLState } from '@/utils/use_url_state';
import { useActions } from './actions';
import { useInject } from './inject';


export type Context = {
  state: State
} & ReturnType<typeof useActions> & SelectedValues


const EventsOverviewContext = createContext<Context>({} as Context);

export const EventsOverviewProvider = ({ children, ...props }: EventsOverviewProviderProps) => {
  const [ memory, set_memory_value ] = useState(init_memory)
  const [ _local_storage, set_persistent_value ] = useLocalStorage({ key: props.local_storage_key, defaultValue: init_local_storage})  
  const local_storage = _local_storage ?? init_local_storage

  const selectors = useSelectors()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, local_storage, injected: {}
    }), [props, memory, local_storage ]), 
    selectors
  )

  const set_state = useCallback((recipe: (draft: Draft<State>)=>void) => {
    const new_state = produce(state, recipe)   
    set_memory_value(new_state.memory)   
    set_persistent_value(new_state.local_storage)
  }, [set_persistent_value, set_memory_value, state])

  const actions = useActions(state, selectors, injected_actions, set_state)
  const selected: SelectedValues = Object.fromEntries(Object.entries(selectors)
    .map(([key, selector]): [string, any] => [key.slice(4), selector(state)])) as SelectedValues

  const context: Context = {
    state,
    ...selected,
    ...actions
  }

  return <EventsOverviewContext.Provider value={context}>
    {children}
  </EventsOverviewContext.Provider>
}

export const useEventsOverviewContext = () => {
  const context = useContext(EventsOverviewContext);

  if (context === undefined) {
    throw new Error("useEventsOverviewContext must be used within EventsOverviewProvider");
  }

  return context;
};

