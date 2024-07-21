"use client"

import { useCUDGlobalVolunteerSettings, useFindGlobalVolunteerSettings } from "@/server_actions/global_volunteer_settings/hooks"
import { useNProgress } from "@/utils/use_nprogress"
import { Select, Stack, Title } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useCallback, useEffect } from "react"
import { Views, View } from "react-big-calendar"

const views = Object.values(Views)
const is_valid_view = (view: string | null): view is View => views.includes(view as View)

export default function Page() {
  const { mutateAsync: cud_global_volunteer_settings, isPending } = useCUDGlobalVolunteerSettings()
  const { data, isFetching, isSuccess } = useFindGlobalVolunteerSettings({ find_many: {
    orderBy: { created_at: 'desc' },
    take: 1
  }})

  const settings = data?.[0]
  useNProgress(isFetching || isPending)

  useEffect(() => {
    if (isSuccess && !settings) {
      console.error("No global volunteer settings found. Creating with default values.")
      cud_global_volunteer_settings({ create: [{ 
        data: { }
      }] })
    }
  }, [isSuccess, settings, cud_global_volunteer_settings])


  const on_change_deadline = useCallback(async (deadline: Date | null) => {
    if (!settings) return
    await cud_global_volunteer_settings({ update: [{ where: { id: settings.id }, data: { edit_deadline: deadline } }] })
  }, [settings, cud_global_volunteer_settings])

  const on_change_view = useCallback(async (view: string | null) => {
    if (!settings) return
    if (!is_valid_view(view)) return
    await cud_global_volunteer_settings({ update: [{ where: { id: settings.id }, data: { default_calendar_view: view } }] })
  }, [settings, cud_global_volunteer_settings])

  const on_change_data = useCallback(async (date: Date | null) => {
    if (!settings) return
    await cud_global_volunteer_settings({ update: [{ where: { id: settings.id }, data: { default_calendar_date: date } }] })
  }, [settings, cud_global_volunteer_settings])

  if (!settings) return <></>

  return <Stack p="sm">
    <Title order={1}>Global volunteer settings</Title>
    <DateTimePicker 
      label="Volunteer edit deadline" 
      clearable 
      value={settings.edit_deadline}
      onChange={on_change_deadline}
    />

    <DateTimePicker 
      label="Default calendar date" 
      clearable 
      value={settings.default_calendar_date}
      onChange={on_change_data}
    />

    <Select
      label="Default calendar view"
      clearable
      onChange={on_change_view}
      value={settings.default_calendar_view}
      data={views}
    />
  </Stack>
}