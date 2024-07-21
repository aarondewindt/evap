"use client"

import { Box, Button, List, Paper, Stack, Text, TextInput, Title } from "@mantine/core"
import type { CalendarEvent, VolunteerViewProps } from "./types"
import { VolunteerViewProvider, useVolunteerViewContext } from "./context"
import { Toolbar } from "../toolbar"
import { IconCancel, IconDeviceFloppy, IconEdit, IconHelp } from "@tabler/icons-react"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Calendar, Views } from "react-big-calendar"
import { localizer, DnDCalendar } from "@/calendar_localizer"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { ExpandHeight } from "@/utils/expand_height"
import { BigCalendar } from "../big_calendar"
import { RichText } from "../rich_text"
import { modals } from "@mantine/modals"
import { DT } from "../datetime"






export const VolunteerView = (props: VolunteerViewProps) => {
  return <VolunteerViewProvider {...props}>
    <VolunteerViewInner/>
  </VolunteerViewProvider>
}

const VolunteerViewInner = ({}: {}) => {
  const ctx = useVolunteerViewContext()

  const show_help_modal = () => {
    modals.open({
      title: <>
        Thanks for volunteering for SoWee 2024!!
      </>,
      children: <>
        <Text>
          On this page you can edit your availability and eventually view your schedule. Feel free to leave any notes for the 
          SoWee comittee here or contact us through the Whatsapp group if you have any questions.
        </Text>
        <Text mt="sm">
          To edit your availability:
        </Text>
        <List>
          <List.Item>Start by clicking the edit button.</List.Item>
          <List.Item>Click and drag on the calendar to mark time slots as available.</List.Item>
          <List.Item>Double click slots to delete them.</List.Item>
          <List.Item>And remember to save when you are done editing!!</List.Item>
        </List>
        { ctx.edit_deadline && 
          <Box mt="sm">
            <Text fw={700}>
              You have untill 
              the <DT date={ctx.edit_deadline} format="Do [of] MMMM"/> to edit your availability.
            </Text>             
            Please contact Aaron de Windt directly if you 
            need to make changes after this date.
          </Box>
        }
        
        <Button mt="xl" fullWidth onClick={() => modals.closeAll()}>Got it!</Button>
      </>,
      size: "xl",
    })
  }

  useEffect(() => {
    const timeout_id = setTimeout(() => {
      if (!ctx.help_msg_shown_before) {
        show_help_modal()
        ctx.on_help_msg_shown()
      }
    }, 500)

    return () => { clearTimeout(timeout_id) }
  })

  return <>
    <Toolbar
      left={<EditSaveCancelToolbarButton
        is_editing={ctx.is_editing}
        readonly={!ctx.has_edit_permission || ctx.has_deadline_passed}
        onEdit={ctx.on_enable_editing}
        onSave={ctx.on_save}
        onCancel={ctx.on_cancel_editing}
      />}

      center={<>{
        ctx.has_deadline_passed ? <>
          <Toolbar.Text color="red.5">Deadline has passed</Toolbar.Text>
        </> : <>{
          ctx.edit_deadline &&
          <Toolbar.Text>Deadline: <DT date={ctx.edit_deadline} format="Do [of] MMMM"/></Toolbar.Text>
        }</>
        
      }</>}

      right={<>
        <Toolbar.Button
          leftSection={<IconHelp/>}
          onClick={show_help_modal}>
            Help
        </Toolbar.Button>
      </>}
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
