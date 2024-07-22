import { EventView } from "@/components/event_view"


export type PageProps = {
  params: {
    event_id: string
  }
}


export default function Page({ params: { event_id }}: PageProps) {
  return <>
    <EventView event_id={event_id} />
  </>
}
