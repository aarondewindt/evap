import { useFindVolunteers } from '@/server_actions/volunteers/hooks'
import { Prisma } from '@prisma/client'
import type { ReactNode } from 'react'
import { BigCalendarEvent } from '../big_calendar/types'


export const volunteer_get_payload_includes: { availability_slots: true } = { availability_slots: true }
export type VolunteerInfo = Prisma.VolunteerGetPayload<{ include: typeof volunteer_get_payload_includes}>

export type CEvent = BigCalendarEvent & {
  resource: {}
}

export type VolunteerAvailibiltyViewProps = { }

export type Memory = { foo: number }

export type Injected = { 
  volunteers_query?: ReturnType<typeof useFindVolunteers>
}

export interface VolunteerAvailibiltyViewProviderProps extends VolunteerAvailibiltyViewProps {
  children: ReactNode
}

export interface State {
  props: VolunteerAvailibiltyViewProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { foo: 0 }
