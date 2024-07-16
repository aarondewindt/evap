import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useDeleteVolunteers, useGetVolunteersById, useUpdateVolunteers } from "@/server_actions/volunteers/hooks"
import { useCheckPermissions } from "@/server_actions/session/hooks"
import { permissions } from "@/server_actions/session/types"


export const useInject = (state: State, s: Selectors) => {
  const { mutate: update_volunteers } = useUpdateVolunteers()
  const { mutate: delete_volunteers } = useDeleteVolunteers()
  const state_1 = useInjectValues(state, "other", {
    volunteers_query: useGetVolunteersById(...s.sel_get_volunteers_query_params(state)),
    has_edit_permission: useCheckPermissions([permissions.any_authenticated]),
  })

  return {
    state: state_1,
    injected_actions: {
      update_volunteers,
      delete_volunteers
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
