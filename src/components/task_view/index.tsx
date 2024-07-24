
import { } from "@mantine/core"
import type { TaskViewProps } from "./types"
import { TaskViewProvider, useTaskViewContext } from "./context"


export const TaskView = (props: TaskViewProps) => {
  return <TaskViewProvider {...props}>
    <TaskViewInner/>
  </TaskViewProvider>
}

const TaskViewInner = ({}: {}) => {
  const ctx = useTaskViewContext()
  return <></>
}
