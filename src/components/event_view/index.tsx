"use client"


import { Portal, Stack, Tabs, TextInput } from "@mantine/core"
import type { ActivityCEvent, EventViewAsideProps, EventViewProps } from "./types"
import { EventViewProvider, useEventViewContext } from "./context"
import { Toolbar } from "../toolbar"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { ChangeEvent, useCallback, useEffect } from "react"
import { DateTimePicker, DateValue } from "@mantine/dates"
import { RichText } from "../rich_text"
import { useGlobalStateContext } from "@/app/global_state"
import { IconX } from "@tabler/icons-react"
import { BigCalendar } from "../big_calendar"


export const EventView = (props: EventViewProps) => {
  return <EventViewProvider {...props}>
    <EventViewInner/>
  </EventViewProvider>
}

const EventViewInner = ({}: {}) => {
  const ctx = useEventViewContext()

  if (!ctx.event) return <></>

  return <>
    <Toolbar
      left={<EditSaveCancelToolbarButton
        is_editing={ctx.is_editing}
        readonly={!ctx.has_edit_permission}
        onEdit={ctx.on_enable_editing}
        onSave={ctx.on_save}
        onCancel={ctx.on_cancel_editing}
      />}

      right={<>
        { ctx.on_close && 
          <Toolbar.ActionIcon onClick={ctx.on_close}>
            <IconX/>
          </Toolbar.ActionIcon>}
      </>}
    />

    <Tabs defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">
          General
        </Tabs.Tab>
        <Tabs.Tab value="activities">
          Activities
        </Tabs.Tab>
        <Tabs.Tab value="tasks">
          Tasks
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">
        <GeneralTab/>
      </Tabs.Panel>

      <Tabs.Panel value="activities">
        <ActivitiesTab/>
      </Tabs.Panel>

      <Tabs.Panel value="tasks">
        <TasksTab/>
      </Tabs.Panel>
    </Tabs>
  </>
}



export const EventViewAside = ({ event_id, ...props}: EventViewAsideProps) => {
  const gctx = useGlobalStateContext()
  const { is_aside_open, on_aside_toggle } = gctx
  
  useEffect(() => {
    if ((!!event_id) == is_aside_open) return
    if (!event_id) {
      on_aside_toggle(false)
    } else {
      on_aside_toggle(true)
    }
  }, [ event_id, is_aside_open, on_aside_toggle ])

  if (!event_id) return <></>

  return <Portal target="#app_shell_aside">
    <EventView event_id={event_id} {...props}/>
  </Portal>
}



const GeneralTab = () => {
  const ctx = useEventViewContext()

  return <Stack p="sm">
    <TextInput 
      label="Name"
      onChange={(e: ChangeEvent<HTMLInputElement>) => { ctx.on_change_event_value("name", e.currentTarget.value) }}
      {...ctx.name_input_props}/>

    <TextInput 
      label="Description"
      onChange={(e: ChangeEvent<HTMLInputElement>) => { ctx.on_change_event_value("description", e.currentTarget.value) }}
      {...ctx.description_input_props}/>

    <DateTimePicker
      label="Start date & time"
      onChange={(e: DateValue) => { e && ctx.on_change_event_value("start_datetime", e) }}
      {...ctx.start_date_time_picker_props}
    />

    <DateTimePicker
      label="End date & time"
      onChange={(e: DateValue) => { e && ctx.on_change_event_value("end_datetime", e) }}
      {...ctx.end_date_time_picker_props}
    />

    <RichText 
      onChange={(e: string) => { e && ctx.on_change_event_value("notes", e) }}
      label="Notes"
      {...ctx.notes_props}/>
  </Stack>
}


const ActivitiesTab = () => {
  const ctx = useEventViewContext()
  const draggableAccessor = useCallback((event: ActivityCEvent) => ctx.is_editing, [ ctx.is_editing ])

  return <Stack p="sm">
    aljkdnals

    <BigCalendar<ActivityCEvent>
      expand_height={true}
      onEventDelete={(cevent) => ctx.on_calendar_delete("activities", cevent)}

      calendar_props={{
        timeslots: 2,
        defaultDate: ctx.event?.start_datetime,
        defaultView: "day",
        draggableAccessor,
        // onSelectEvent: ctx.on_calender_select_event,
        onSelectSlot: (slot_info) => ctx.on_calender_select_slot("activities", slot_info),
        onEventDrop: (e) => ctx.on_calendar_event_edit("activities", e),
        onEventResize: (e) => ctx.on_calendar_event_edit("activities", e),
        // onNavigate: ctx.on_calendar_navigate,
        // onView: ctx.on_calendar_view_change,

        ...ctx.activity_calender_props
      }}
    />
  </Stack>
}


const TasksTab = () => {
  const ctx = useEventViewContext()
  const draggableAccessor = useCallback((event: ActivityCEvent) => ctx.is_editing, [ ctx.is_editing ])

  return <Stack p="sm">
    aljkdnals

    <BigCalendar<ActivityCEvent>
      expand_height={true}
      onEventDelete={(cevent) => ctx.on_calendar_delete("tasks", cevent)}

      calendar_props={{
        timeslots: 2,
        defaultDate: ctx.event?.start_datetime,
        defaultView: "day",
        draggableAccessor,
        // onSelectEvent: ctx.on_calender_select_event,
        onSelectSlot: (slot_info) => ctx.on_calender_select_slot("tasks", slot_info),
        onEventDrop: (e) => ctx.on_calendar_event_edit("tasks", e),
        onEventResize: (e) => ctx.on_calendar_event_edit("tasks", e),
        // onNavigate: ctx.on_calendar_navigate,
        // onView: ctx.on_calendar_view_change,

        ...ctx.tasks_calender_props
      }}
    />
  </Stack>
}