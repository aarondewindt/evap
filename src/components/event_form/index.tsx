
import { Button, Center, Group, Modal, Stack, Text, TextInput } from "@mantine/core"
import type { EventFormProps } from "./types"
import { EventFormProvider, useEventFormContext } from "./context"
import { useGlobalStateContext } from "@/app/global_state"
import { DateTimePicker, DateValue } from '@mantine/dates';
import { RichText } from "../rich_text";
import { ChangeEvent, useState } from "react";
import { IconCancel, IconDeviceFloppy, IconEdit, IconTrash } from "@tabler/icons-react";
import { Toolbar } from "../toolbar";


export const EventForm = (props: EventFormProps) => {
  return <EventFormProvider {...props}>
    <EventFormInner/>
  </EventFormProvider>
}

const EventFormInner = ({}: {}) => {
  const ctx = useEventFormContext()

  if (ctx.mode === "created") return <Center>
    <Text size="xl">Event created!!</Text>
  </Center>

  if (ctx.mode === "deleted") return <Center>
    <Text size="xl">Event deleted!!</Text>
  </Center>

  const toolbal_buttons = (() => { 
    if (!ctx.editable) return <></>

    if (ctx.mode === "view") return <>
      <Toolbar.Button leftSection={<IconEdit/>}
                          onClick={ctx.on_enable_editing}
                          >
        Edit
      </Toolbar.Button>
      <Toolbar.Button leftSection={<IconTrash/>}
                          onClick={ctx.on_delete_event}
                          >
        Delete
      </Toolbar.Button>
    </>

    if (ctx.mode === "edit") return <>
        <Toolbar.Button leftSection={<IconDeviceFloppy/>}
                            onClick={ctx.on_save}
                            >
          Save
        </Toolbar.Button>
        <Toolbar.Button leftSection={<IconCancel/>}
                            onClick={ctx.on_cancel_editing}
                            >
          Cancel
        </Toolbar.Button>
      </>

    if (ctx.mode === "create") return <>
        <Toolbar.Button leftSection={<IconDeviceFloppy/>}
                            onClick={ctx.on_create}
                            >
          Create
        </Toolbar.Button>
        <Toolbar.Button leftSection={<IconCancel/>}
                            onClick={ctx.on_cancel_editing}
                            >
          Cancel
        </Toolbar.Button>
      </>
  })()

  return <Stack>
    <Toolbar
      left={<Text c="gray" size="xs">ID: {ctx.event_id ?? "-"}</Text>} 
      right={toolbal_buttons}
    />
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
      {...ctx.notes_props}/>
  </Stack>
}

export type EventFormFormModalProps = {
  event_id?: string | null
  create_new?: boolean
  editable?: boolean

  onCreate?: (event_id: string) => void
  onClose: () => void
}

export const EventFormFormModal = (p: EventFormFormModalProps) => {
  const gctx = useGlobalStateContext()

  const open_modal = (!!p.event_id) || (!!p.create_new)

  if (!open_modal) return null

  return <>
    <Modal
        size="100%"
        opened={open_modal}
        onClose={p.onClose}
        title={p.create_new ? "Create new event" : "Event"}
        fullScreen={gctx.is_mobile_screen}
        radius={gctx.is_mobile_screen ? 0 : undefined}
      >
        <EventForm event_id={p.event_id} editable={p.editable} /> 
    </Modal>
  </>
}

