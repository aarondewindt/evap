import { Prisma } from '@prisma/client'
import type { ReactNode } from 'react'


export const event_task_get_payload: {
  where?: Prisma.EventTaskWhereInput
  include: {
    location: true,
    event: true,
    volunteers: true,
  }
} = {
  include: {
    location: true,
    event: true,
    volunteers: true,
  }
}


export type TaskViewProps = { 
  task_id: string
  editable?: boolean
}

export type Memory = { 
  edit: null | Prisma.EventTaskGetPayload<typeof event_task_get_payload>
}

export type Injected = { 
  // event_task_query?: ReturnType<typeof useFindManyEventTasks>
}

export interface TaskViewProviderProps extends TaskViewProps {
  children: ReactNode
}

export interface State {
  props: TaskViewProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { 
  edit: null
}
