import { useGetAllVolunteers } from '@/server_actions/volunteers/hooks'
import type { ReactNode } from 'react'


export type VolunteerListProps = {

}

export type Memory = { 
  
}

export type ServerActions = { 
  all_volunteers?: ReturnType<typeof useGetAllVolunteers>
  has_edit_permission?: boolean
}

export interface VolunteerListProviderProps extends VolunteerListProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  props: VolunteerListProps
  server_actions: ServerActions
}

export const init_memory: Memory = { foo: 0 }
