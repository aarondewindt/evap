import { useCUDLocations, useFindManyLocations } from '@/server_actions/locations/hooks'
import { Prisma } from '@prisma/client'
import type { ReactNode } from 'react'


export type LocationListProps = { }

export type Memory = { 
  search_query: string
  selected_location_id: string | null
}

export type Injected = { 
  locations_query?: ReturnType<typeof useFindManyLocations>
  locations_mutation?: ReturnType<typeof useCUDLocations>
  has_edit_permission?: boolean | null
}

export interface LocationListProviderProps extends LocationListProps {
  children: ReactNode
}

export interface State {
  props: LocationListProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { 
  search_query: "",
  selected_location_id: null
}
