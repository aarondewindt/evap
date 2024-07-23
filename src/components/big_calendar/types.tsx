import { MantineColor } from '@mantine/core';
import type { ReactNode } from 'react'
import { Calendar, dayjsLocalizer, Event, CalendarProps, View } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'


export type BigCalendarEvent = {
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  start?: Date | undefined;
  end?: Date | undefined;
  color?: MantineColor | undefined;
  alpha?: number | undefined;
  resource: object;
}


export type CalendarState = {
  view: View
  date: Date
}


export type BigCalendarProps<TEvent extends BigCalendarEvent> = {
  expand_height: boolean
  onEventDelete?: (event: TEvent) => void
  calendar_props?: Omit<withDragAndDropProps<TEvent, BigCalendarEvent['resource']> & CalendarProps<TEvent, BigCalendarEvent['resource']>, "localizer">
}

export type Memory<TEvent extends object> = { 
  view: View
  date: Date
  selected: TEvent | null
}

export type Injected = { bar?: string }

export interface State<TEvent extends BigCalendarEvent> {
  props: BigCalendarProps<TEvent>
  memory: Memory<TEvent>
  injected: Injected
}

