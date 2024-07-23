import { useCUDEvents, useFindManyEvents } from '@/server_actions/events/hooks'
import { Prisma } from '@prisma/client'
import type { ReactNode } from 'react'



export const event_get_payload: {
  where?: Prisma.EventWhereInput
  include: {
    activities: true,
    location: true,
    tasks: true
  }
} = {
  include: {
    activities: true,
    location: true,
    tasks: true
  }
}

export type EventInfo = Prisma.EventGetPayload<typeof event_get_payload>


export type EventViewProps = { 
  event_id: string
  onClose?: () => void
}

export type EventViewAsideProps = Omit<EventViewProps, "event_id"> & {
  event_id: string | null
}

export type Memory = { 
  edit: {
    event: EventInfo
  } | null

}

export type Injected = { 
  events_query?: ReturnType<typeof useFindManyEvents>
  events_mutation?: ReturnType<typeof useCUDEvents>
  has_edit_permission?: boolean | null
}

export interface EventViewProviderProps extends EventViewProps {
  children: ReactNode
}

export interface State {
  props: EventViewProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { edit: null }
