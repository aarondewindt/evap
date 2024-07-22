"use client"


import { Stack, Tabs, TextInput } from "@mantine/core"
import type { EventViewProps } from "./types"
import { EventViewProvider, useEventViewContext } from "./context"
import { Toolbar } from "../toolbar"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { ChangeEvent } from "react"
import { DateTimePicker, DateValue } from "@mantine/dates"
import { RichText } from "../rich_text"


export const EventView = (props: EventViewProps) => {
  return <EventViewProvider {...props}>
    <EventViewInner/>
  </EventViewProvider>
}

const EventViewInner = ({}: {}) => {
  const ctx = useEventViewContext()
  return <>
    <Toolbar
      left={<EditSaveCancelToolbarButton
        is_editing={false}
        readonly={false}
        onEdit={() => {}}
        onSave={() => {}}
        onCancel={() => {}}      
      />}
    />

    <Tabs defaultValue="general">
      <Tabs.List>
        <Tabs.Tab value="general">
          General
        </Tabs.Tab>
        <Tabs.Tab value="schedule">
          Schedule
        </Tabs.Tab>
        <Tabs.Tab value="tasks">
          Volunteer tasks
        </Tabs.Tab>
        <Tabs.Tab value="promo">
          Promo
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">
        <GeneralTab/>
      </Tabs.Panel>

      <Tabs.Panel value="schedule">
        Event Schedule
      </Tabs.Panel>

      <Tabs.Panel value="assignments">
        Volunteer tasks and assignments
      </Tabs.Panel>

      <Tabs.Panel value="promo">
        Promo
      </Tabs.Panel>
    </Tabs>
  </>
  

}


const GeneralTab = () => {
  const ctx = useEventViewContext()

  return <Stack p="sm">
    <TextInput 
      label="Name"
      onChange={(e: ChangeEvent<HTMLInputElement>) => { ctx.on_change_form_value("name", e.currentTarget.value) }}
      {...ctx.name_input_props}/>

    <TextInput 
      label="Description"
      onChange={(e: ChangeEvent<HTMLInputElement>) => { ctx.on_change_form_value("description", e.currentTarget.value) }}
      {...ctx.description_input_props}/>

    <DateTimePicker
      label="Start date & time"
      onChange={(e: DateValue) => { e && ctx.on_change_form_value("start_datetime", e) }}
      {...ctx.start_date_time_picker_props}
    />

    <DateTimePicker
      label="End date & time"
      onChange={(e: DateValue) => { e && ctx.on_change_form_value("end_datetime", e) }}
      {...ctx.end_date_time_picker_props}
    />

    <RichText 
      onChange={(e: string) => { e && ctx.on_change_form_value("notes", e) }}
      label="Notes"
      {...ctx.notes_props}/>
  </Stack>
}