import { useContext, createContext, useCallback, useState, useMemo, useRef, use } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { BigCalendarProps, State } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useActions } from './actions';
import { useInject } from './inject';


export type UseBigCalendarStateReturnType<TEvent extends object, TResource extends object> = {
  state: State<TEvent, TResource>
} & ReturnType<typeof useActions> & SelectedValues<TEvent, TResource>


export const useInitState = <TEvent extends object, TResource extends object>(props: BigCalendarProps<TEvent, TResource>): State<TEvent, TResource> => {
  const ref = useRef<State<TEvent, TResource>>({
    props,
    memory: { 
      view: props.calendar_props?.defaultView ?? "month",
      date: new Date(props.calendar_props?.defaultDate ?? new Date()),
    },
    injected: {}
  })
  return ref.current
}


export const useBigCalendarContext = <TEvent extends object, TResource extends object>
                                   (props: BigCalendarProps<TEvent, TResource>) => {
  const init_state = useInitState<TEvent, TResource>(props)                                  
  const [ memory, set_memory_value ] = useState(init_state.memory)

  const selectors = useSelectors<TEvent, TResource>()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, injected: {}
    }), [ props, memory ]), 
    selectors
  )

  const set_state = useCallback((recipe: (draft: Draft<State<TEvent, TResource>>)=>void) => {
    const new_state = produce(state, recipe)   
    set_memory_value(new_state.memory)
  }, [ set_memory_value, state ])

  const actions = useActions<TEvent, TResource>(state, selectors, injected_actions, set_state)
  const selected: SelectedValues<TEvent, TResource> = Object.fromEntries(Object.entries(selectors)
    .map(([key, selector]): [string, any] => [key.slice(4), selector(state)])) as SelectedValues<TEvent, TResource>

  return {
    state,
    ...selected,
    ...actions
  }
}
