
import { } from "@mantine/core"
import type { BigCalendarProps } from "./types"
import { useBigCalendarContext } from "./context"


export const BigCalendar = <TEvent extends object = Event, TResource extends object = object>
                           (props: BigCalendarProps<TEvent, TResource>) => {
  // This is not a react context. This instance must be passed to all child components
  const ctx = useBigCalendarContext(props)

  return <>
  </>
}
