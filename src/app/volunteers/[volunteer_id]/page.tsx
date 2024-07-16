import { VolunteerView } from "@/components/volunteer_view"


export type PageProps = {
  params: {
    volunteer_id: string
  }
}


export default function Page({ params: { volunteer_id }}: PageProps) {
  return <>
    <VolunteerView volunteer_id={volunteer_id} />
  </>
}
