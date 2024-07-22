import { IconCancel, IconDeviceFloppy, IconEdit, IconEditOff } from "@tabler/icons-react"
import { Toolbar } from "../toolbar"
import { ReactElement } from "react"


export type EditSaveCancelToolbarButtonProps = {
  is_editing: boolean
  readonly: boolean

  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}


export const EditSaveCancelToolbarButton = 
      ({ is_editing, readonly, onEdit, onSave, onCancel}: EditSaveCancelToolbarButtonProps) => {
        
  if (readonly) return <></>
  return (is_editing ? <>
    <Toolbar.Button 
        leftSection={<IconCancel/>}
        onClick={onCancel}>
      Cancel
    </Toolbar.Button>
    <Toolbar.Button 
        leftSection={<IconDeviceFloppy/>}
        onClick={onSave}
        >
      Save
    </Toolbar.Button>
  </> : <Toolbar.Button 
          leftSection={<IconEdit/>}
          onClick={onEdit}>
      Edit
    </Toolbar.Button>
  )
}


export type EditDoneToolbarButtonProps = {
  is_editing: boolean
  readonly: boolean

  edit_label?: ReactElement | string
  done_label?: ReactElement | string

  onEdit: () => void
  onDone: () => void
}

export const EditDoneToolbarButton =
        ({ is_editing, readonly, onEdit, onDone, edit_label, done_label}: EditDoneToolbarButtonProps) => {
        
  if (readonly) return <></>
  return (is_editing ? <>
    <Toolbar.Button 
        leftSection={<IconEditOff/>}
        onClick={onDone}>
      { done_label ?? "Done" }
    </Toolbar.Button>
  </> : <Toolbar.Button 
          leftSection={<IconEdit/>}
          onClick={onEdit}>
      { edit_label ?? "Edit" }
    </Toolbar.Button>
  )
}