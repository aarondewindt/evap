import type { ReactNode } from 'react'

export const persistent_key = "component_persistent_key"
export const url_key = "component_url_key"

export type ComponentProps = { }
export type Memory = { 
  counter_a: number
}
export type Persistent = {
  counter_b: number
}
export type URLData = {
  counter_c: number
}
export type Queries = { }
export type Mutations = { }

export interface ComponentProviderProps extends ComponentProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  persistent: Persistent
  url_params: URLData
  props: ComponentProps
  queries: Queries
  mutations: Mutations
}

export const init_memory: Memory = {
  counter_a: 0
}

export const init_persistent: Persistent = {
  counter_b: 0
}

export const init_url_params: URLData = {
  counter_c: 0
}
