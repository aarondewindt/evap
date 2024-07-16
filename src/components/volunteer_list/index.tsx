"use client"


import { Table, Text } from "@mantine/core"
import type { VolunteerListProps } from "./types"
import { VolunteerListProvider, useVolunteerListContext } from "./context"
import { Toolbar } from "../toolbar"
import { IconPlus } from "@tabler/icons-react"
import { useRouter } from "next/navigation"


export const VolunteerList = (props: VolunteerListProps) => {
  return <VolunteerListProvider {...props}>
    <VolunteerListInner/>
  </VolunteerListProvider>
}

const VolunteerListInner = ({}: {}) => {
  const ctx = useVolunteerListContext()
  const router = useRouter()
  return <>
    <Toolbar 
      left={<>
        { ctx.has_edit_permission && 
          <Toolbar.Button 
              leftSection={<IconPlus/>}
              onClick={ctx.on_new_volunteer}>
          New volunteer
        </Toolbar.Button>
        }
            
      </>}
    />

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody style={{cursor: "pointer"}}>
        {ctx.all_volunteers?.map((volunteer) => (
          <Table.Tr key={volunteer.id}
                    onClick={() => { router.push(`/volunteers/${volunteer.id}`) }}
                    >
            <Table.Td>
              <Text>{volunteer.name}</Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </>
}
