"use client"

import { darken, getThemeColor, isLightColor, lighten, luminance, MantineColor, useMantineTheme } from "@mantine/core"
import type { BigCalendarEvent, BigCalendarProps } from "./types"
import { useBigCalendarContext } from "./context"
import { ExpandHeight } from "@/utils/expand_height"
import { CSSProperties, Fragment, useCallback } from "react"
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from '@/dates'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

// Multi day events
// TU schedule background color

// export const localizer = dayjsLocalizer(dayjs)

export const localizer = momentLocalizer(moment)

const DnDCalendar = withDragAndDrop(Calendar)

export const BigCalendar = <TEvent extends BigCalendarEvent = BigCalendarEvent>(props: BigCalendarProps<TEvent>) => {
  const TypedDnDCalendar = DnDCalendar as unknown as ReturnType<typeof withDragAndDrop<TEvent, TEvent['resource']>>
  const ctx = useBigCalendarContext(props)
  const theme = useMantineTheme();
  const calendar_props = props.calendar_props ?? {}
  const expand_height_wrapper = ctx.expand_height ? ExpandHeight : Fragment

  // console.log("BigCalendar", { calendar_props, ctx })

  const event_prop_getter = useCallback((event: BigCalendarEvent, start: Date, end: Date, isSelected: boolean) => {
    let bg = getThemeColor(event.color ?? 'blue', theme)
    if (isSelected) bg = darken(bg, 0.3)

    const tx = lighten(bg, 0.95)
    const style: CSSProperties = {
      backgroundColor: bg,
      color: tx,
      borderColor: darken(bg, 0.30),
    }
    return { style }
  }, [ theme ])

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

      eventPropGetter={event_prop_getter}
      showMultiDayTimes

      onKeyPressEvent={ctx.on_key_press_event}

      {...ctx.calender_props}
      {...calendar_props}
    />
  })
  
}

