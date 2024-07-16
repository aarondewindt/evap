"use client"

import { Box, Stack, Text, TextInput, Title } from "@mantine/core"
import type { VolunteerViewProps } from "./types"
import { VolunteerViewProvider, useVolunteerViewContext } from "./context"
import { Toolbar } from "../toolbar"
import { IconCancel, IconDeviceFloppy, IconEdit } from "@tabler/icons-react"
import React, { ChangeEvent, useCallback, useMemo, useState } from "react"
import { Calendar, Views } from "react-big-calendar"
import { localizer, DnDCalendar } from "@/calendar_localizer"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"






export const VolunteerView = (props: VolunteerViewProps) => {
  return <VolunteerViewProvider {...props}>
    <VolunteerViewInner/>
  </VolunteerViewProvider>
}

const VolunteerViewInner = ({}: {}) => {
  const ctx = useVolunteerViewContext()

  return <>
    <Toolbar
      left={<Text c="gray" size="xs">ID: {ctx.volunteer_id ?? "-"}</Text>} 
      right={<EditSaveCancelToolbarButton
        is_editing={ctx.is_editing}
        readonly={!ctx.has_edit_permission}
        onEdit={ctx.on_enable_editing}
        onSave={ctx.on_save}
        onCancel={ctx.on_cancel_editing}
      />}
    />
    <Stack p="sm">
      <TextInput 
        label="Name" 
        onChange={(e: ChangeEvent<HTMLInputElement>) => { ctx.on_name_change(e.target.value)}}
        {...ctx.name_input_props}
      />     
      <AvailabilityCalendar/> 
    </Stack>
  </>
  
}


const AvailabilityCalendar = ({}: {}) => {
  const ctx = useVolunteerViewContext()

  return <Stack>
    <Title order={3}>Availability</Title>
    <Box style={{height: 600}}>
      {/* @ts-ignore */} 
      <DnDCalendar
        localizer={localizer}
        defaultView="week"
        dayLayoutAlgorithm="no-overlap"
        step={15}

        onNavigate={ctx.on_calendar_navidate}
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
  </Stack>
}
