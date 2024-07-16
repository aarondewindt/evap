import { useMemo } from "react"
import { State } from "./types"
import { Selectors } from "./selectors"
import { useMediaQuery } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import { useUpdateEvents } from "@/server_actions/events/hooks"
import { useSessionQuery } from "@/server_actions/session/hooks"


export const useInject = (state: State, s: Selectors) => {
  const state_1 = useInjectValue(state, "other", "is_mobile_screen", 
    useMediaQuery('(max-width: 48em)')
  )

  const state_2 = useInjectValue(state_1, "queries", "session",
    useSessionQuery()
  )

  return {
    state: state_2,
    injected_actions: {}
  }
}


export const useInjectValue = <S extends keyof State, K extends keyof (State[S])>
                        (state: State, storage: S,  key: K,  value: State[S][K]): State => {
  return useMemo(() => {
    const new_state = { ...state, [storage]: { ...state[storage], [key]: value }}
    return new_state
  }, [state, storage, key, value])                     
}
