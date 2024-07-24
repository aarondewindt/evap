import type { ReactNode } from 'react'

export type ComponentProps = { }
export type Memory = { foo: number }
export type Injected = { bar?: string }

export interface ComponentProviderProps extends ComponentProps {
  children: ReactNode
}

export interface State {
  props: ComponentProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { foo: 0 }
