import { useCUDLocations, useFindManyLocations } from '@/server_actions/locations/hooks'
import { Location, Prisma } from '@prisma/client'
import type { ReactNode } from 'react'

export type LocationViewProps = { 
  location_id: string
}

export type LocationViewAsideProps = Omit<LocationViewProps, "location_id"> & {
  location_id: string | null
}

export type LocationViewModalProps = Omit<LocationViewProps, "location_id"> & {
  location_id: string | null
  onClose: () => void
}

export type Memory = { 
  edit: Location | null
}

export type Injected = { 
  locations_query?: ReturnType<typeof useFindManyLocations>
  locations_mutation?: ReturnType<typeof useCUDLocations>
  has_edit_permission?: boolean | null
}

export interface LocationViewProviderProps extends LocationViewProps {
  children: ReactNode
}

export interface State {
  props: LocationViewProps
  memory: Memory
  injected: Injected
}

export const init_memory: Memory = { 
  edit: null
}
