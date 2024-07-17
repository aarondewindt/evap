import { useGetVolunteersById } from '@/server_actions/volunteers/hooks'
import { Prisma } from '@/db'
import type { ReactNode } from 'react'
import { View, Event as RbcEvent } from 'react-big-calendar'
import { BigCalendarEvent } from '../big_calendar'

export type VolunteerInfo = Prisma.VolunteerGetPayload<{ include: { availability_slots: true }}>

export type CalendarEvent = BigCalendarEvent & {
  resource: Prisma.VolunteerAvailabilitySlotGetPayload<{}>
}

export type VolunteerViewProps = { 
  volunteer_id: string
}

export type Memory = { 
  edit: {
    volunteer: VolunteerInfo
    new_availability_slots: Prisma.VolunteerAvailabilitySlotGetPayload<{}>[]
    updated_availability_slots: Prisma.VolunteerAvailabilitySlotGetPayload<{}>[]
    deleted_availability_slots: string[]
  } | null

  calendar_date: Date
  calendar_view: View

  selected_slot_id: string | null
}

export type Other = {
  volunteers_query?: ReturnType<typeof useGetVolunteersById>
  has_edit_permission?: boolean
}

export interface VolunteerViewProviderProps extends VolunteerViewProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  props: VolunteerViewProps
  other: Other
}

export const init_memory: Memory = { 
  edit: null,
  calendar_date: new Date(),
  calendar_view: 'week',
  selected_slot_id: null
}
