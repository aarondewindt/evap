import type { ReactNode } from 'react'

export const local_storage_key = "component_local_storage_key"

export type EventViewProps = { 
  event_id: string
}

export type Memory = { foo: number }
export type LocalStorage = { }
export type Injected = { bar?: string }

export interface EventViewProviderProps extends EventViewProps {
  children: ReactNode
}

export interface State {
  props: EventViewProps
  memory: Memory
  local_storage: LocalStorage  
  injected: Injected
}

export const init_memory: Memory = { foo: 0 }
export const init_local_storage: LocalStorage = { }
