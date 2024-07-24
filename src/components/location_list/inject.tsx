import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useCUDLocations, useFindManyLocations } from "@/server_actions/locations/hooks"
import { useCheckPermissions } from "@/server_actions/session/hooks"
import { permissions } from "@/server_actions/session/types"
import { useNProgress } from "@/utils/use_nprogress"


export const useInject = (state: State, s: Selectors) => {
  const locations_mutation = useCUDLocations()

  const state_1 = useInjectValues(state, "injected", {
    locations_query: useFindManyLocations({ args: { } }),
    has_edit_permission: useCheckPermissions([permissions.any_authenticated]),
  })


  useNProgress(s.sel_is_fetching(state_1))

  return {
    state: state_1,
    injected_actions: {
      cud_locations: locations_mutation.mutateAsync,
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
