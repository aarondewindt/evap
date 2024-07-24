"use client"


import { Table, Text } from "@mantine/core"
import type { LocationListProps } from "./types"
import { LocationListProvider, useLocationListContext } from "./context"
import { Toolbar } from "../toolbar"
import { IconPlus } from "@tabler/icons-react"
import { LocationViewAside } from "../location_view"
import { Link } from "../link"


export const LocationList = (props: LocationListProps) => {
  return <LocationListProvider {...props}>
    <LocationListInner/>
  </LocationListProvider>
}

const LocationListInner = ({}: {}) => {
  const ctx = useLocationListContext()

  return <>
    <Toolbar 
      left={<>
        { ctx.has_edit_permission && 
          <Toolbar.Button 
              leftSection={<IconPlus/>}
              onClick={ctx.on_new_location}>
          New location
        </Toolbar.Button>
        }
            
      </>}
    />
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Address</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody style={{cursor: "pointer"}}>
        {ctx.locations?.map((location) => (
          <Table.Tr key={location.id}
                    onClick={() => { ctx.on_change_selected_location(location.id) }}
                    style={{backgroundColor: location.id === ctx.selected_location_id ? "var(--mantine-primary-color-0)" : undefined}}
                    >
            <Table.Td>
              <Text>{location.name}</Text>
            </Table.Td>
            <Table.Td>
              <Text>{location.description}</Text>
            </Table.Td>
            <Table.Td>
              <Link href={location.maps_url}>{location.address}</Link>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>

    <LocationViewAside location_id={ctx.selected_location_id}/>
  </>
}
