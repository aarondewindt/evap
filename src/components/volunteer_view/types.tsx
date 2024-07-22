import { useCUDVolunteers, useFindVolunteers } from '@/server_actions/volunteers/hooks'
import { Prisma } from '@/db'
import type { ReactNode } from 'react'
import { View, Event as RbcEvent } from 'react-big-calendar'
import { useGlobalVolunteerSettings } from '@/server_actions/global_volunteer_settings/hooks'
import { BigCalendarEvent } from '../big_calendar/types'

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

  optimistic: VolunteerInfo | null

  calendar_date: Date
  calendar_view: View
  calendar_settings_set: boolean

  selected_slot_id: string | null
}

export type Injected = {
  volunteers_query?: ReturnType<typeof useFindVolunteers>
  cud_volunteers_mutation?: ReturnType<typeof useCUDVolunteers>
  global_volunteer_settings?: ReturnType<typeof useGlobalVolunteerSettings>
  help_msg_shown_before?: boolean
}

export interface VolunteerViewProviderProps extends VolunteerViewProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  props: VolunteerViewProps
  injected: Injected
}

export const init_memory: Memory = { 
  edit: null,
  optimistic: null,
  calendar_date: new Date(),
  calendar_view: 'week',
  selected_slot_id: null,
  calendar_settings_set: false,
}
