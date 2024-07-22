"use client"

import { Box, Stack } from "@mantine/core"
import type { CalendarEvent, EventsOverviewProps } from "./types"
import { EventsOverviewProvider, useEventsOverviewContext } from "./context"
import { Toolbar } from "../toolbar"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { DnDCalendar, localizer } from "@/calendar_localizer"
import { ExpandHeight } from "@/utils/expand_height"
import { BigCalendar } from "../big_calendar"
import { Prisma } from "@/db"
import { useCallback } from "react"


export const EventsOverview = (props: EventsOverviewProps) => {
  return <EventsOverviewProvider {...props}>
    <EventsOverviewInner/>
  </EventsOverviewProvider>
}


const EventsOverviewInner = ({}: {}) => {
  const ctx = useEventsOverviewContext()

  const draggableAccessor = useCallback((event: CalendarEvent) => ctx.is_editing, [ ctx.is_editing ])

  return <>
    <Toolbar
      right={<EditSaveCancelToolbarButton
        is_editing={ctx.is_editing}
        readonly={!ctx.has_edit_permission}
        onEdit={ctx.on_enable_editing}
        onSave={ctx.on_save}
        onCancel={ctx.on_cancel_editing}
      />}
    />
    
    <BigCalendar<CalendarEvent> 
      expand_height
      
      calendar_props={{
        popup: true,
        draggableAccessor,
        onSelectEvent: ctx.on_calender_select_event,
        onSelectSlot: ctx.on_calender_select_slot,
        onDoubleClickEvent: ctx.on_calendar_double_click,
        onEventDrop: ctx.on_calendar_event_edit,
        onEventResize: ctx.on_calendar_event_edit,
        onNavigate: ctx.on_calendar_navigate,
        onView: ctx.on_calendar_view_change,

        ...ctx.calender_props
      }}     
    />
  </>
}
