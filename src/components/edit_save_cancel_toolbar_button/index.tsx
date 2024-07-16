import { IconCancel, IconDeviceFloppy, IconEdit } from "@tabler/icons-react"
import { Toolbar } from "../toolbar"


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