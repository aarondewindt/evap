import type { ReactNode } from 'react'

export const local_storage_key = "component_local_storage_key"
export const url_key = "component_url_key"

export type ComponentProps = { }
export type Memory = { foo: number }
export type LocalStorage = { }
export type URLStorage = { }
export type Queries = { q1?: string }
export type Mutations = { }

export interface ComponentProviderProps extends ComponentProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  local_storage: LocalStorage
  url: URLStorage
  props: ComponentProps
  queries: Queries
  mutations: Mutations
}

export const init_memory: Memory = { foo: 0 }
export const init_local_storage: LocalStorage = { }
export const init_url: URLStorage = {}
