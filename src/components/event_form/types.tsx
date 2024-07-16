import { useCreateEvents, useDeleteEvents, useGetEventsById, useUpdateEvents } from '@/server_actions/events/hooks'
import type { ReactNode } from 'react'

export type EventFormProps = { 
  event_id?: string | null
  editable?: boolean
  onCreate?: (event_id: string) => void
}

export type FormValues = { 
  name: string
  description: string
  start_datetime: Date
  end_datetime: Date
  notes: string
}

export type FormViewState = { mode: "view" }
export type FormEditState = { mode: "edit", values: FormValues } 
export type FormCreateState = { mode: "create", values: FormValues }
export type FormCreatedState = { mode: "created" }
export type FormDeletedState = { mode: "deleted" }
export type FormState = FormViewState | FormEditState | FormCreateState | FormCreatedState | FormDeletedState

export type Memory = { 
  form: FormState
}

export type Queries = { 
  events?: ReturnType<typeof useGetEventsById>
}

export type Mutations = {
  update_events?: Omit<ReturnType<typeof useUpdateEvents>, "mutate" | "mutateAsync">
  create_events?: Omit<ReturnType<typeof useCreateEvents>, "mutate" | "mutateAsync">
  delete_events?: Omit<ReturnType<typeof useDeleteEvents>, "mutate" | "mutateAsync">
}

export interface EventFormProviderProps extends EventFormProps {
  children: ReactNode
}

export interface State {
  memory: Memory
  props: EventFormProps
  queries: Queries
  mutations: Mutations
}

export const init_memory: Memory = { 
  form: { mode: "view" }
}

export const default_form_values: FormValues = {
  name: "",
  description: "",
  start_datetime: new Date(),
  end_datetime: new Date(),
  notes: ""
}
