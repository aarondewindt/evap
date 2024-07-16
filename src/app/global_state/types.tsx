import { useSessionQuery } from '@/server_actions/session/hooks'
import type { ReactNode } from 'react'

export const local_storage_key = "evap_state"
export const url_key = "g"

export type Memory = { 
  is_nav_open: boolean
}

export type LocalStorage = {

}

export type URLStorage = {

}

export type Queries = {
  session: ReturnType<typeof useSessionQuery>
}

export type Mutations = {
  
}

export type Other = {
  is_mobile_screen?: boolean
}

export interface GlobalStateProviderProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  local_storage: LocalStorage
  url: URLStorage
  queries: Queries
  mutations: Mutations
  other: Other
}

export const init_memory: Memory = { 
  is_nav_open: false
}

export const init_local_storage: LocalStorage = { }

export const init_url: URLStorage = {}
