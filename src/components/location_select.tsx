import { useFindManyLocations } from "@/server_actions/locations/hooks";
import { Anchor, Button, Input, Paper, Select, SelectProps, Stack, Text } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import { useCallback, useMemo, useState } from "react";
import { LocationViewModal } from "./location_view";



export type LocationSelectProps = {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
} & SelectProps


export const LocationSelect = ({ value, defaultValue, onChange, ...props }: LocationSelectProps) => {
  const [ modal_location_id, set_modal_location_id ] = useState<string | null>(null)  
  const { isSuccess, data } = useFindManyLocations({ args: {}})
  const [_value, handleChange] = useUncontrolled<string | null>({
    value,
    defaultValue,
    onChange,
  });

  const select_data = useMemo(() => {
    if (!isSuccess) return []
    return data.map((location) => ({
      label: location.name,
      value: location.id,
      location: location
    }))
  }, [isSuccess, data])

  const selected_location = useMemo(() => {
    if (!isSuccess) return null
    return data.find((location) => location.id === _value) ?? null
  }, [isSuccess, data, _value])


  const on_open_modal = useCallback(() => {
    set_modal_location_id(_value)
  }, [_value, set_modal_location_id])

  const on_close_modal = useCallback(() => {
    set_modal_location_id(null)
  }, [set_modal_location_id])

  if (props.readOnly || props.disabled) {
    console.log("modal_location_id", _value, modal_location_id)

    return <Input.Wrapper label={props.label} 
                          description={props.description}
                          error={props.error}>
      <Paper 
        withBorder
        className="location_value">
          <Anchor onClick={on_open_modal}>
            { selected_location?.name ?? "" }  
          </Anchor>
      </Paper>
      <LocationViewModal location_id={modal_location_id} onClose={on_close_modal} />
    </Input.Wrapper>
  } else {
    return <Select
      searchable
      clearable
      data={select_data}
      value={_value}
      onChange={handleChange}
      // renderOption={render_option}
      {...props}
    />
  }
}

// const render_option: SelectProps['renderOption'] = ({ option, checked }) => {
//   return <Stack 
//             gap={0} 
//             bg={checked ? "blue.0" : undefined} 
//             p={2}
//             styles={{ 
//               root: { 
//                 width: "100%",
//               },
//             }}
//             >
//     <Text>{option.label}</Text>
//     <Text size="xs" c="gray">{option.location.description}</Text>
//   </Stack>
// }
