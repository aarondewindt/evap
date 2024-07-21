import { Avatar, Box, Button, Group, MantineColor, Menu, Stack, Text, rem } from "@mantine/core"
import { signIn, signOut,  } from "next-auth/react"

import { IconLogout } from '@tabler/icons-react';
import { useGlobalStateContext } from "@/app/global_state";


export type SessionStatusProps = {
  text_color?: MantineColor
}


export const SessionStatus = ({ text_color }: SessionStatusProps) => {
  const gctx = useGlobalStateContext()

  const session = gctx.session
  if (!session?.authenticated) 
    return <Box style={{height: "2em"}}>
      <Button 
        component="span"
        variant="outline"
        color={ text_color }
        onClick={() => { signIn() }}
        >Admin sign in</Button>
    </Box>

  return <Box style={{height: "2em"}}>
    <Group gap={5} justify="end">
      <Stack gap={0}>
        <Text ta="right" c={ text_color } size="xs">Signed in as</Text>
        <Text ta="right" c={ text_color }>{ session.user.name }</Text>
      </Stack>

      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Box pos="relative">
            <Avatar component="button" src={session.user.image} top={-2}/>
          </Box>          
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
