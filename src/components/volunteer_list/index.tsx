"use client"


import { Stack, Table, Text, TextInput, Title } from "@mantine/core"
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

    <Stack gap="xs" p="xs">
      <Title order={3} >
        Welcome to the SoWee 2024 volunteer list!!
      </Title>
      <Text>
        { "If this is you first time here, please click on the 'New volunteer' button to add yourself to the list." }
      </Text>

      <TextInput 
                placeholder="Search volunteers"
                onChange={(e) => ctx.on_search_query_change(e.currentTarget.value)}
                />

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody style={{cursor: "pointer"}}>
          {ctx.volunteers?.map((volunteer) => (
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
    </Stack>
  </>
}
