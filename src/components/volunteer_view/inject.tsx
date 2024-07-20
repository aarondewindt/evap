import { use, useEffect, useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useCUDVolunteers, useFindVolunteers } from "@/server_actions/volunteers/hooks"
import { useCheckPermissions } from "@/server_actions/session/hooks"
import { permissions } from "@/server_actions/session/types"
import { useLocalStorage } from "@mantine/hooks"


export const useInject = (state: State, s: Selectors) => {
  const [ help_msg_shown_before, set_help_msg_shown_before ] = useLocalStorage<boolean>({
    key: "evap_volunteer_view_help",
    defaultValue: false
  })

  const cud_volunteers_mutation = useCUDVolunteers()
  const state_1 = useInjectValues(state, "injected", {
    volunteers_query: useFindVolunteers(s.sel_get_volunteers_query_params(state)),
    cud_volunteers_mutation,
    help_msg_shown_before
  })

  return {
    state: state_1,
    injected_actions: {
      cud_volunteers: cud_volunteers_mutation.mutateAsync,
      set_help_msg_shown_before
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
