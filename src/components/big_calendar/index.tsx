
import { } from "@mantine/core"
import type { BigCalendarProps } from "./types"
import { useBigCalendarContext } from "./context"
import { ExpandHeight } from "@/utils/expand_height"
import { Fragment } from "react"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from '@/dates'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'


// Multi day events
// TU schedule background color

export const localizer = dayjsLocalizer(dayjs)


export type BigCalendarEvent = {
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  start?: Date | undefined;
  end?: Date | undefined;
  resource: object;
}

const DnDCalendar = withDragAndDrop(Calendar)

export const BigCalendar = <TEvent extends BigCalendarEvent = BigCalendarEvent>(props: BigCalendarProps<TEvent, TEvent['resource']>) => {
  const TypedDnDCalendar = DnDCalendar as unknown as ReturnType<typeof withDragAndDrop<TEvent, TEvent['resource']>>
  const ctx = useBigCalendarContext(props)
  const calendar_props = props.calendar_props ?? {}
  const expand_height_wrapper = ctx.expand_height ? ExpandHeight : Fragment

  // console.log("BigCalendar", { calendar_props, ctx })

  return expand_height_wrapper({ children:
    <TypedDnDCalendar
    style={{ flexGrow: 1, minHeight: 600 }}
      localizer={localizer}
      // dayLayoutAlgorithm="no-overlap"
      step={15}
      timeslots={4}
      popup

      onNavigate={ctx.on_calendar_navigate}
      onView={ctx.on_calendar_view_change}

      {...calendar_props}
      {...ctx.calender_props}
    />
  })
  
}

