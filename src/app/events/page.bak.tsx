"use client"
// import { useGetAllEvents } from "@/server_actions/events"
import { useGetAllEvents } from "@/server_actions/events/hooks"
import { Button, Table, Text } from "@mantine/core"
import dayjs from "@/dates"
import { useNProgress } from "@/utils/use_nprogress"
import { EventForm, EventFormFormModal } from "@/components/event_form"
import { useState } from "react"
import { Toolbar } from "@/components/toolbar"
import { IconPlus } from "@tabler/icons-react"



type EventModalState = {
  event_id: string
} | {
  create_new: true
} | {}

export default function Page() {
  const { data: events, isFetching, status, ...p } = useGetAllEvents()
  const [ event_modal_state, event_modal_state_set ] = useState<EventModalState>({})

  // useNProgress(isFetching)

  const on_click_event = (event_id: string) => {
    event_modal_state_set({ event_id })
  }

  const on_close_event_modal = () => {
    event_modal_state_set({})
  }

  const on_click_create_event = () => {
    event_modal_state_set({ create_new: true })
  }

  console.log("Events Page", status, {events, p})

  return <>
    <Toolbar 
      left={<>        
        <Toolbar.Button leftSection={<IconPlus/>}
              onClick={on_click_create_event}>
          New event
        </Toolbar.Button>    
      </>}
    />

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Event</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Start date</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody style={{cursor: "pointer"}}>
        {events?.map((event) => (
          <Table.Tr key={event.id} onClick={() => {on_click_event(event.id)}}>
            <Table.Td><Text fw={500}>{event.name}</Text></Table.Td>
            <Table.Td>{event.description}</Table.Td>
            <Table.Td>{ dayjs(event.start_datetime).calendar() }</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
    
    <EventFormFormModal onClose={on_close_event_modal} {...event_modal_state} editable/>
  </>
}
