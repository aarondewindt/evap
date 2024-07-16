import { useContext, createContext, useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import produce, {Draft} from "immer"

import { init_memory, init_persistent, State, ComponentProviderProps, Memory, persistent_key, 
         Persistent, init_url_params, URLData, url_key } from "./types"
import { useSelectors } from "./selectors"
import { useURLState } from 'components/use_url_state';
import { useTransitions } from './transitions';


export type Context = {
  state: State

  counter_a: number
  counter_b: number
  counter_c: number
  counter_sum: number

} & ReturnType<typeof useTransitions>


const ComponentContext = createContext<Context>({} as Context);

export const ComponentProvider = ({ children, ...props }: ComponentProviderProps) => {
  const [ _persistent, set_persistent_value ] = useLocalStorage({ key: persistent_key, defaultValue: init_persistent})  
  const persistent = _persistent ?? init_persistent
  const [ url_params, set_url_params_value] = useURLState<URLData>(url_key, init_url_params)
  const [ memory, set_memory_value ] = useState(init_memory)

  const s = useSelectors()
  
  let state: State = {
    props, memory, persistent, url_params, queries: {}, mutations: {}
  }

  const set_state = useCallback((recipe: (draft: Draft<State>)=>void, 
                                 locations: ("memory" | "persistent" | "url_params")[]=["memory", "persistent", "url_params"]) => {
    const new_state = produce(
      { props, memory, persistent, url_params, queries: state.queries, mutations: state.mutations }, recipe)   
    if (locations.includes("memory")) set_memory_value(new_state.memory)   
    if (locations.includes("persistent")) set_persistent_value(new_state.persistent)
    if (locations.includes("url_params")) set_url_params_value(new_state.url_params)
  }, [set_persistent_value, set_memory_value, set_url_params_value, props, memory, persistent, url_params, 
      // Individual items in the queries and mutations states need tobe passed here. Otherwise this Callback will not
      // be memoized.
      state.queries, state.mutations
  ])

  const set_memory = useCallback((recipe: (draft: Draft<Memory>)=>void) => {
    set_memory_value(produce(memory, recipe))
  }, [ set_memory_value, memory ])

  const set_persistent = useCallback((recipe: (draft: Draft<Persistent>)=>void) => {
    set_persistent_value(produce(persistent, recipe))
  }, [ set_persistent_value, persistent ])

  const set_url_params = useCallback((recipe: (draft: Draft<URLData>)=>void) => {
    set_url_params_value(produce(url_params, recipe))
  }, [ set_url_params_value, url_params ])

  const transitions = useTransitions(state, s, set_state, set_memory, set_persistent, set_url_params)

  const context: Context = {
    state,

    counter_a: s.sel_counter_a(state),
    counter_b: s.sel_counter_b(state),
    counter_c: s.sel_counter_c(state),
    counter_sum: s.sel_counter_sum(state),

    ...transitions
  }

  return <ComponentContext.Provider value={context}>
    {children}
  </ComponentContext.Provider>
}

export const useComponentContext = () => {
  const context = useContext(ComponentContext);

  if (context === undefined) {
    throw new Error("useComponentContext must be used within ComponentProvider");
  }

  return context;
};


