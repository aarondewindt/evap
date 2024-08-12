
import { Stack, Title } from "@mantine/core"
import type { CEvent, VolunteerAvailibiltyViewProps } from "./types"
import { VolunteerAvailibiltyViewProvider, useVolunteerAvailibiltyViewContext } from "./context"
import { BigCalendar } from "../big_calendar"


export const VolunteerAvailibiltyView = (props: VolunteerAvailibiltyViewProps) => {
  return <VolunteerAvailibiltyViewProvider {...props}>
    <VolunteerAvailibiltyViewInner/>
  </VolunteerAvailibiltyViewProvider>
}

const VolunteerAvailibiltyViewInner = ({}: {}) => {
  const ctx = useVolunteerAvailibiltyViewContext()
  return <Stack>
    <Title order={3}>Volunteers Availibilty</Title>

    <BigCalendar<CEvent> 
      expand_height
      
      calendar_props={{
        ...ctx.calender_props
      }}
    />

  </Stack>
}
