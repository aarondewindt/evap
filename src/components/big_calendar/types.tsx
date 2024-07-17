import type { ReactNode } from 'react'
import { Calendar, dayjsLocalizer, Event, CalendarProps } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'

export const local_storage_key = "BigCalendar_local_storage_key"



export type BigCalendarProps<TEvent extends object, TResource extends object> = {

} & withDragAndDropProps<TEvent, TResource> & CalendarProps<TEvent, TResource>


export type Memory<TEvent extends object, TResource extends object> = { foo: number }
export type LocalStorage = { }
export type Injected = { bar?: string }

export interface State<TEvent extends object, TResource extends object> {
  props: BigCalendarProps<TEvent, TResource>
  memory: Memory<TEvent, TResource>
  local_storage: LocalStorage  
  injected: Injected
}

// export const init_memory: Memory = { foo: 0 }
export const init_local_storage: LocalStorage = { }
