import { useGetAllEvents } from '@/server_actions/events/hooks'
import { Prisma } from '@prisma/client'
import type { ReactNode } from 'react'
import { View } from 'react-big-calendar'


export type EventCalendarSettings = {
  view: View
  date: Date
}


export type EventsOverviewProps = { 
  local_storage_key: string
}

export type Memory = {
  selected_event_id: string | null
  edit: {
    new_events: Prisma.EventGetPayload<{}>[]
    updated_events: Prisma.EventGetPayload<{}>[]
    deleted_event_ids: string[]
  } | null
}

export type LocalStorage = {
  calendar_settings: EventCalendarSettings
}

export type Injected = {
  events_query?: ReturnType<typeof useGetAllEvents>
  has_edit_permission?: boolean
}

export interface EventsOverviewProviderProps extends EventsOverviewProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  local_storage: LocalStorage
  props: EventsOverviewProps
  injected: Injected
}

export const init_memory: Memory = { 
  selected_event_id: null,
  edit: null
}

export const init_local_storage: LocalStorage = { 
  calendar_settings: {
    view: 'month',
    date: new Date()
  }
}
