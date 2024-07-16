import { Avatar, Box, Group, Menu, Stack, Text, rem } from "@mantine/core"
import { signOut,  } from "next-auth/react"

import { IconLogout } from '@tabler/icons-react';
import { useGlobalStateContext } from "@/app/global_state";


export const SessionStatus = () => {
  const gctx = useGlobalStateContext()

  const session = gctx.session
  if (!session?.authenticated) return <></>

  return <Box style={{height: "2em"}}>
    <Group gap={5} justify="end">
      <Stack gap={0}>
        <Text ta="right" size="xs">Signed in as</Text>
        <Text ta="right">{ session.user.name }</Text>
      </Stack>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Avatar component="button" src={session.user.image}/>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                     onClick={() => { signOut() }}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  </Box>
}
