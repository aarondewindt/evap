"use client"


import { EventView } from "@/components/event_view"
import { TaskView } from "@/components/task_view"


export type PageProps = {
  params: {
    task_id: string
  }
}


export default function Page({ params: { task_id }}: PageProps) {
  return <>
    <TaskView task_id={task_id} editable/>
  </>
}
