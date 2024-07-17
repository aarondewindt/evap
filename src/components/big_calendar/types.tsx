import type { ReactNode } from 'react'
import { Calendar, dayjsLocalizer, Event, CalendarProps, View } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'


export type CalendarState = {
  view: View
  date: Date
}


export type BigCalendarProps<TEvent extends object, TResource extends object> = {
  expand_height: boolean
  calendar_props?: Omit<withDragAndDropProps<TEvent, TResource> & CalendarProps<TEvent, TResource>, "localizer">
}

export type Memory<TEvent extends object, TResource extends object> = { 
  view: View
  date: Date
}

export type Injected = { bar?: string }

export interface State<TEvent extends object, TResource extends object> {
  props: BigCalendarProps<TEvent, TResource>
  memory: Memory<TEvent, TResource>
  injected: Injected
}

