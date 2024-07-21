"use client"

import { DT } from "@/components/datetime"
import { useCUDUsers, useFindUsers } from "@/server_actions/users/hooks"
import { useNProgress } from "@/utils/use_nprogress"
import { Button, Group, Table, Text } from "@mantine/core"
import { modals } from "@mantine/modals"

export default function Page() {
  const { data } = useFindUsers({ find_many: {} })

  const { mutateAsync: cud_users, status } = useCUDUsers()

  useNProgress(!data || status === 'pending')

  if (!data) return <></>

  const on_click_verify = (user_id: string) =>
    modals.openConfirmModal({
      title: 'Verify user',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to verify this user?
        </Text>
      ),
      labels: { confirm: 'Verify', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: async () => {
        await cud_users({ update: [{ where: { id: user_id }, data: { is_verified: true } }] })
      },
    });

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Joined at</Table.Th>
          <Table.Th>Is verified</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map(user => (
          <Table.Tr key={user.id}>
            <Table.Td>{user.name}</Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>{<DT date={user.createdAt}/>}</Table.Td>
            <Table.Td>{user.is_verified ? "Yes" : <>
              <Group>
                <Text>No</Text>
                <Button size="xs" variant="light" color="red" onClick={() => on_click_verify(user.id)}>Verify</Button>
              </Group>
            </>}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}