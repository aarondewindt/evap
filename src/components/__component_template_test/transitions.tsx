import { useCallback } from "react"
import { useSelectors } from "./selectors"
import { State, Memory, Persistent, URLData } from "./types"
import {Draft} from "immer"


export const useTransitions = (
      state: State,
      s: ReturnType<typeof useSelectors>,
      set_state: (recipe: (draft: Draft<State>)=>void, locations?: ("memory" | "persistent" | "url_params")[])=>void,
      set_memory: (recipe: (draft: Draft<Memory>)=>void)=>void,
      set_persistent: (recipe: (draft: Draft<Persistent>)=>void)=>void,
      set_url_params: (recipe: (draft: Draft<URLData>)=>void)=>void) => {
  
  return {  
    set_state_a_increased: useCallback(() => {
      set_state((draft) => {
        draft.memory.counter_a += 1
      })
    }, [set_state]),

    set_state_b_increased: useCallback(() => {
      set_state((draft) => {
        draft.persistent.counter_b += 1
      })
    }, [set_state]),

    set_state_c_increased: useCallback(() => {
      set_state((draft) => {
        draft.url_params.counter_c += 1
      })
    }, [set_state]),

    counters_increased: useCallback(() => {
      set_state((draft) => {
        draft.memory.counter_a += 1
        draft.persistent.counter_b += 1
        draft.url_params.counter_c += 1
      })
    }, [set_state]),

    set_state_a_increased_location: useCallback(() => {
      set_state((draft) => {
        draft.memory.counter_a += 1
        draft.persistent.counter_b += 1
        draft.url_params.counter_c += 1
      }, ['memory'])
    }, [set_state]),

    set_state_b_increased_location: useCallback(() => {
      set_state((draft) => {
        draft.memory.counter_a += 1
        draft.persistent.counter_b += 1
        draft.url_params.counter_c += 1
      }, ['persistent'])
    }, [set_state]),

    set_state_c_increased_location: useCallback(() => {
      set_state((draft) => {
        draft.memory.counter_a += 1
        draft.persistent.counter_b += 1
        draft.url_params.counter_c += 1
      }, ['url_params'])
    }, [set_state]),
    
    a_increased: useCallback(() => {
      set_memory((draft) => {
        draft.counter_a += 1
      })
    }, [set_memory]),

    b_increased: useCallback(() => {
      set_persistent((draft) => {
        draft.counter_b += 1
      })
    }, [set_persistent]),

    c_increased: useCallback(() => {
      set_url_params((draft) => {
        draft.counter_c += 1
      })
    }, [set_url_params]),
  }
}
