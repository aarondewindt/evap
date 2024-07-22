import { useSessionQuery } from '@/server_actions/session/hooks'
import { ReadonlyURLSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

export const local_storage_key = "evap_state"

export type Memory = { 
  is_nav_open: boolean
}

export type LocalStorage = {

}

export type Injected = {
  is_mobile_screen?: boolean
  session?: ReturnType<typeof useSessionQuery>
  path_name?: string
  search_params?: ReadonlyURLSearchParams
}

export interface GlobalStateProviderProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  local_storage: LocalStorage
  injected: Injected
}

export const init_memory: Memory = { 
  is_nav_open: false
}

export const init_local_storage: LocalStorage = { }

