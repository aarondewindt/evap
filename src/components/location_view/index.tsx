
import { Box, Portal, Stack, TextInput } from "@mantine/core"
import type { LocationViewAsideProps, LocationViewProps } from "./types"
import { LocationViewProvider, useLocationViewContext } from "./context"
import { ChangeEvent, useEffect } from "react"
import { Toolbar } from "../toolbar"
import { EditSaveCancelToolbarButton } from "../edit_save_cancel_toolbar_button"
import { RichText } from "../rich_text"
import { useGlobalStateContext } from "@/app/global_state"


export const LocationView = (props: LocationViewProps) => {
  return <LocationViewProvider {...props}>
    <LocationViewInner/>
  </LocationViewProvider>
}

const LocationViewInner = ({}: {}) => {
  const ctx = useLocationViewContext()

  if (!ctx.location) return <></>

  return <>
    <Toolbar
      left={<EditSaveCancelToolbarButton
        is_editing={ctx.is_editing}
        readonly={!ctx.has_edit_permission}
        onEdit={ctx.on_enable_editing}
        onSave={ctx.on_save}
        onCancel={ctx.on_cancel_editing}
      />}
    />
    <Stack p="xs">
      <TextInput 
        label="Name" 
        value={ctx.location.name} 
        readOnly={!ctx.is_editing}
        onChange={(e: ChangeEvent<HTMLInputElement>) => ctx.on_location_field_change("name", e.currentTarget.value)}/>

      <TextInput
        label="Description"
        value={ctx.location.description}
        readOnly={!ctx.is_editing}
        onChange={(e: ChangeEvent<HTMLInputElement>) => ctx.on_location_field_change("description", e.currentTarget.value)}/>

      <TextInput
        label="Address"
        value={ctx.location.address}
        readOnly={!ctx.is_editing}
        onChange={(e: ChangeEvent<HTMLInputElement>) => ctx.on_location_field_change("address", e.currentTarget.value)}/>

      <TextInput
        label="Maps url"
        value={ctx.location.maps_url}
        readOnly={!ctx.is_editing}
        onChange={(e: ChangeEvent<HTMLInputElement>) => ctx.on_location_field_change("maps_url", e.currentTarget.value)}/>

      <RichText
        label="Notes"
        value={ctx.location.notes ?? ""}
        editor_enabled={ctx.is_editing}
        onChange={(value) => ctx.on_location_field_change("notes", value)}/>
      
      
    </Stack>
  </>
}





export const LocationViewAside = ({ location_id, ...props}: LocationViewAsideProps) => {
  const gctx = useGlobalStateContext()
  const { is_aside_open, on_aside_toggle } = gctx
  
  useEffect(() => {
    if ((!!location_id) == is_aside_open) return
    if (!location_id) {
      on_aside_toggle(false)
    } else {
      on_aside_toggle(true)
    }
  }, [ location_id, is_aside_open, on_aside_toggle ])

  if (!location_id) return <></>

  return <Portal target="#app_shell_aside">
    <LocationView location_id={location_id} {...props}/>
  </Portal>
}
