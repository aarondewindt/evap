"use client"

import { Box } from "@mantine/core"
import type { EventsOverviewProps } from "./types"
import { EventsOverviewProvider, useEventsOverviewContext } from "./context"
import { Toolbar } from "../toolbar"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { DnDCalendar, localizer } from "@/calendar_localizer"


export const EventsOverview = (props: EventsOverviewProps) => {
  return <EventsOverviewProvider {...props}>
    <EventsOverviewInner/>
  </EventsOverviewProvider>
}

const EventsOverviewInner = ({}: {}) => {
  const ctx = useEventsOverviewContext()

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
    
    <Box style={{height: 600}}>
      {/* @ts-ignore */}
      <DnDCalendar
        localizer={localizer}
        dayLayoutAlgorithm="no-overlap"
        step={15}

        onNavigate={ctx.on_calendar_navigate}
        onView={ctx.on_calendar_view_change}
        onSelectEvent={ctx.on_calender_select_event}
        onSelectSlot={ctx.on_calender_select_slot}
        onDoubleClickEvent={ctx.on_calendar_double_click}
        onEventDrop={ctx.on_calendar_event_edit}
        onEventResize={ctx.on_calendar_event_edit}

        draggableAccessor={(event) => ctx.is_editing}
        popup
        resizable={ctx.is_editing}

        {...ctx.calender_props}
        
      />
    </Box>

  </>
}
