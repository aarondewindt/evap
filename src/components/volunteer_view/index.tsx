"use client"

import { Box, Button, List, Paper, Stack, Text, TextInput, Title, useMantineTheme } from "@mantine/core"
import type { CalendarEvent, VolunteerViewProps } from "./types"
import { VolunteerViewProvider, useVolunteerViewContext } from "./context"
import { Toolbar } from "../toolbar"
import { IconCancel, IconDeviceFloppy, IconEdit, IconHelp } from "@tabler/icons-react"
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Calendar, SlotGroupPropGetter, Views } from "react-big-calendar"
import { localizer, DnDCalendar } from "@/calendar_localizer"
import { EditDoneToolbarButton, EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { ExpandHeight } from "@/utils/expand_height"
import { BigCalendar } from "../big_calendar"
import { RichText } from "../rich_text"
import { modals } from "@mantine/modals"
import { DT } from "../datetime"
import { useDidUpdate } from "@mantine/hooks"






export const VolunteerView = (props: VolunteerViewProps) => {
  return <VolunteerViewProvider {...props}>
    <VolunteerViewInner/>
  </VolunteerViewProvider>
}


const owee_start = new Date(2024, 7, 18)
const owee_end = new Date(2024, 7, 22, 23, 59, 59)


const VolunteerViewInner = ({}: {}) => {
  const ctx = useVolunteerViewContext()
  const theme = useMantineTheme()

  const show_help_modal = useCallback(() => {
    modals.open({
      title: <>
        Welcome SoWee 2024 volunteer!!
      </>,
      children: <>
        {/* <Text>
          You can fill in your availability and eventually view your schedule on this page. Feel free to leave any notes for the 
          SoWee comittee or contact us through the Whatsapp group if you have any questions.
        </Text> */}
        <Text mt="sm">
          To edit your availability:
        </Text>
        <List>
          {/* <List.Item>Start by clicking the edit button.</List.Item> */}
          <List.Item>Click and drag on the calendar.</List.Item>
          <List.Item>Touchscreen? Longpress before dragging.</List.Item>
          <List.Item>Double click to delete.</List.Item>
          <List.Item>Changes are saved automatically.</List.Item>
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
  }, [ ctx.edit_deadline ])
  
  useDidUpdate(() => {
    if (ctx.global_volunteer_settings?.isSuccess) {
      ctx.on_change_date_and_view(
        ctx.global_volunteer_settings.data?.default_calendar_date || null,
        ctx.global_volunteer_settings.data?.default_calendar_view || null,
      )
      if (!ctx.help_msg_shown_before) {
        show_help_modal()
        ctx.on_help_msg_shown()
      }
    }   
  }, [ ctx.global_volunteer_settings?.isSuccess ])


  useDidUpdate(() => {
    ctx.on_enable_editing()
  }, [ ctx.volunteer_q?.isSuccess ])

  const draggable_accessor = useCallback((event: CalendarEvent) => ctx.is_editing, [ ctx.is_editing ])

  const day_prop_getter = useCallback((date: Date) => {
    const bg = date >= owee_start && date <= owee_end ? theme.colors.blue[0] : undefined
    return { style: { backgroundColor: bg } }
  }, [ theme.colors.blue ])

  const slotPropGetter = useCallback((date: Date) => {
    if (!(date >= owee_start && date <= owee_end)) return {}
    return { style: { 
      backgroundColor: theme.colors.primary[0],
      borderColor: theme.colors.primary[1],
    }}
  }, [ theme.colors.primary ])

  const slotGroupPropGetter = useCallback((group: Date[]) => {            
    if (group.every((date) => !(date >= owee_start && date <= owee_end))) return {}
    return { style: {
      borderColor: theme.colors.primary[1],
    }}
  }, [ theme.colors.primary ]) as SlotGroupPropGetter  // There is a bug in the type definition


  if (!ctx.global_volunteer_settings?.isSuccess) return <></>

  return <>
    <Toolbar
      // left={<EditSaveCancelToolbarButton
      //   is_editing={ctx.is_editing}
      //   readonly={!ctx.has_edit_permission || ctx.has_deadline_passed}
      //   onEdit={ctx.on_enable_editing}
      //   onSave={ctx.on_save}
      //   onCancel={ctx.on_cancel_editing}
      // />}

      // left={<EditDoneToolbarButton
      //   is_editing={ctx.is_editing}
      //   readonly={!ctx.has_edit_permission || ctx.has_deadline_passed}
      //   onEdit={ctx.on_enable_editing}
      //   onDone={ctx.on_cancel_editing}
      //   done_label="Finish editing"
      // />}

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

      <Text>
        Please make sure your availability between the 18th and 22nd of August is up to date before the deadline.
      </Text>

      <BigCalendar<CalendarEvent> 
        expand_height
        
        onEventDelete={ctx.on_calendar_double_click}

        calendar_props={{
          popup: true,
          draggableAccessor: draggable_accessor,
          onSelectEvent: ctx.on_calender_select_event,
          onSelectSlot: ctx.on_calender_select_slot,
          onDoubleClickEvent: ctx.on_calendar_double_click,
          onEventDrop: ctx.on_calendar_event_edit,
          onEventResize: ctx.on_calendar_event_edit,
          onView: ctx.on_calendar_view_change,
          onNavigate: ctx.on_calendar_navidate,

          dayPropGetter: day_prop_getter,
          slotPropGetter,
          slotGroupPropGetter,


          ...ctx.calender_props,
        }}
      />

    </Stack>
  </>
  
}
