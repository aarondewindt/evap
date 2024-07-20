"use client"

import { Box, Paper, Stack, Text, TextInput, Title } from "@mantine/core"
import type { CalendarEvent, VolunteerViewProps } from "./types"
import { VolunteerViewProvider, useVolunteerViewContext } from "./context"
import { Toolbar } from "../toolbar"
import { IconCancel, IconDeviceFloppy, IconEdit } from "@tabler/icons-react"
import React, { ChangeEvent, useCallback, useMemo, useState } from "react"
import { Calendar, Views } from "react-big-calendar"
import { localizer, DnDCalendar } from "@/calendar_localizer"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { ExpandHeight } from "@/utils/expand_height"
import { BigCalendar } from "../big_calendar"
import { RichText } from "../rich_text"






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
    <Stack p="sm" pb={0}>
      <TextInput 

        label="Name" 
        onChange={(e: ChangeEvent<HTMLInputElement>) => { ctx.on_name_change(e.target.value)}}
        {...ctx.name_input_props}
      />
      
      <RichText value={ctx.notes} label="Notes" editor_enabled={ctx.is_editing} onChange={ctx.on_notes_change}/>



      <BigCalendar<CalendarEvent> 
        expand_height
        
        calendar_props={{
          popup: true,
          draggableAccessor: (event) => ctx.is_editing,
          onSelectEvent: ctx.on_calender_select_event,
          onSelectSlot: ctx.on_calender_select_slot,
          onDoubleClickEvent: ctx.on_calendar_double_click,
          onEventDrop: ctx.on_calendar_event_edit,
          onEventResize: ctx.on_calendar_event_edit,

          ...ctx.calender_props
        }}
      />

    </Stack>
  </>
  
}
