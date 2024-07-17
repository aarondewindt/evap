import type { ReactNode } from 'react'

export const local_storage_key = "component_local_storage_key"

export type ComponentProps = { }
export type Memory = { foo: number }
export type LocalStorage = { }
export type Injected = { bar?: string }

export interface ComponentProviderProps extends ComponentProps {
  children: ReactNode
}

export interface State {
  props: ComponentProps
  memory: Memory
  local_storage: LocalStorage  
  injected: Injected
}

export const init_memory: Memory = { foo: 0 }
export const init_local_storage: LocalStorage = { }
