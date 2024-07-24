import type { ReactNode } from 'react'

export type TaskViewProps = { 
  task_id: string
}

export type Memory = { 
  foo: number 
}

export type Injected = { 
  bar?: string
}

export interface TaskViewProviderProps extends TaskViewProps {
  children: ReactNode
}

export interface State {
  props: TaskViewProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { foo: 0 }
