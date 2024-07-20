import { useCUDVolunteers, useFindVolunteers } from '@/server_actions/volunteers/hooks'
import type { ReactNode } from 'react'


export type VolunteerListProps = {

}

export type Memory = { 
  search_query: string
}

export type Injected = { 
  all_volunteers?: ReturnType<typeof useFindVolunteers>
  cud_volunteers_mutation?: ReturnType<typeof useCUDVolunteers>
}

export interface VolunteerListProviderProps extends VolunteerListProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  props: VolunteerListProps
  injected: Injected
}

export const init_memory: Memory = { 
  search_query: ""
}
