import { useContext, createContext, useCallback, useState, useMemo, useRef, use } from 'react'
import { useLocalStorage } from '@mantine/hooks';
import {produce, Draft} from "immer"

import { BigCalendarEvent, BigCalendarProps, State } from "./types"
import { useSelectors, SelectedValues } from "./selectors"
import { useActions } from './actions';
import { useInject } from './inject';


export type UseBigCalendarStateReturnType<TEvent extends BigCalendarEvent> = {
  state: State<TEvent>
} & ReturnType<typeof useActions> & SelectedValues<TEvent>


export const useInitState = <TEvent extends BigCalendarEvent>(props: BigCalendarProps<TEvent>): State<TEvent> => {
  const ref = useRef<State<TEvent>>({
    props,
    memory: { 
      view: props.calendar_props?.defaultView ?? "month",
      date: new Date(props.calendar_props?.defaultDate ?? new Date()),
      selected: null
    },
    injected: {}
  })
  return ref.current
}


export const useBigCalendarContext = <TEvent extends BigCalendarEvent>
                                   (props: BigCalendarProps<TEvent>) => {
  const init_state = useInitState<TEvent>(props)                                  
  const [ memory, set_memory_value ] = useState(init_state.memory)

  const selectors = useSelectors<TEvent>()

  const { state, injected_actions } = useInject(
    useMemo(() => ({
      props, memory, injected: {}
    }), [ props, memory ]), 
    selectors
  )

  const set_state = useCallback((recipe: (draft: Draft<State<TEvent>>)=>void) => {
    const new_state = produce(state, recipe)   
    set_memory_value(new_state.memory)
  }, [ set_memory_value, state ])

  const actions = useActions<TEvent>(state, selectors, injected_actions, set_state)
  const selected: SelectedValues<TEvent> = Object.fromEntries(Object.entries(selectors)
    .map(([key, selector]): [string, any] => [key.slice(4), selector(state)])) as SelectedValues<TEvent>

  return {
    state,
    ...selected,
    ...actions
  }
}
