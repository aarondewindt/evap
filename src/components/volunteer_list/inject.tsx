import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useFindVolunteers, useCUDVolunteers } from "@/server_actions/volunteers/hooks"
import { useNProgress } from "@/utils/use_nprogress"
import { useCheckPermissions } from "@/server_actions/session/hooks"
import { permissions } from "@/server_actions/session/types"


export const useInject = (state: State, s: Selectors) => {
  const cud_volunteers_mutation = useCUDVolunteers()

  const state_1 = useInjectValues(state, "injected", {
    all_volunteers: useFindVolunteers({find_many: {}}),
    cud_volunteers_mutation
  })

  useNProgress(s.sel_is_fetching(state_1))

  return {
    state: state_1,
    injected_actions: {
      cud_volunteers: cud_volunteers_mutation['mutateAsync']
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
