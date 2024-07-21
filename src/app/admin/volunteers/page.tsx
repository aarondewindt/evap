"use client"

import { useCUDGlobalVolunteerSettings, useFindGlobalVolunteerSettings } from "@/server_actions/global_volunteer_settings/hooks"
import { useNProgress } from "@/utils/use_nprogress"
import { Stack, Title } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useCallback, useEffect } from "react"


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

  if (!settings) return <></>

  return <Stack p="sm">
    <Title order={1}>Global volunteer settings</Title>
    <DateTimePicker 
      label="Volunteer edit deadline" 
      clearable 
      value={settings.edit_deadline}
      onChange={on_change_deadline}
      />
  </Stack>
}