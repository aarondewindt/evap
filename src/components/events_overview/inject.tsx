import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useCUDEvents, useGetAllEvents } from "@/server_actions/events/hooks"
import { useCheckPermissions } from "@/server_actions/session/hooks"
import { permissions } from "@/server_actions/session/types"


export const useInject = (state: State, s: Selectors) => {
  const { mutateAsync: cud_events_async } = useCUDEvents()
  const state_1 = useInjectValues(state, "injected", {
    events_query: useGetAllEvents(),
    has_edit_permission: useCheckPermissions([ permissions.any_authenticated ])
  })

  return {
    state: state_1,
    injected_actions: {
      cud_events_async
    }
  }
}


export const useInjectValue = <S extends keyof State, K extends keyof (State[S])>
                        (state: State, storage: S,  key: K,  value: State[S][K]): State => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], [key]: value }}
    return new_state
  }, [state, storage, key, value])                     
}

export const useInjectValues = <S extends keyof State, K extends keyof (State[S])>
                        (state: State, storage: S, values: {[key in K]: State[S][K]} ): State => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], ...values }}
    return new_state
  }, [state, storage, values])                     
}
