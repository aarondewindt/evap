
import { } from "@mantine/core"
import type { BigCalendarProps } from "./types"
import { useBigCalendarContext } from "./context"
import { ExpandHeight } from "@/utils/expand_height"
import { Component, ComponentType, Fragment } from "react"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from '@/dates'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'


// Multi day events
// TU schedule background color

export const localizer = dayjsLocalizer(dayjs)


export const createBigCalendar = <TEvent extends object = Event, TResource extends object = object>() => {
  const DnDCalendar = withDragAndDrop(Calendar<TEvent, TResource>)

  return (props: BigCalendarProps<TEvent, TResource>) => {
    // This is not a react context. This instance must be passed to all child components
    const ctx = useBigCalendarContext(props)

    const expand_height_wrapper = ctx.expand_height ? ExpandHeight : Fragment

    return expand_height_wrapper({ children: 
      <DnDCalendar
        localizer={localizer}
        // dayLayoutAlgorithm="no-overlap"
        step={15}
        timeslots={4}
        popup

        onNavigate={ctx.on_calendar_navigate}
        onView={ctx.on_calendar_view_change}
        // onSelectEvent={ctx.on_calender_select_event}
        // onSelectSlot={ctx.on_calender_select_slot}
        // onDoubleClickEvent={ctx.on_calendar_double_click}
        // onEventDrop={ctx.on_calendar_event_edit}
        // onEventResize={ctx.on_calendar_event_edit}

        // draggableAccessor={(event) => ctx.is_editing}
        
        // resizable={ctx.is_editing}

        {...ctx.calender_props}
        
      />})
  }
}


