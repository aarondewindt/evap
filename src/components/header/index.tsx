import { Box, Burger, Group, Text } from "@mantine/core"
import { SessionStatus } from "../session_status"
import { useGlobalStateContext } from "@/app/global_state"


export const Header = () => {
  const gctx = useGlobalStateContext()

  return <Group justify="space-between" h="100%" px="md">
    <Box>
      <Burger opened={gctx.is_nav_open} hiddenFrom='sm' size="sm" onClick={gctx.on_nav_toggle}/>
      <Text size="xl" fw={700} c="primary.0">SoWee Event planner</Text>
    </Box>
    <Box pos="relative" top={-3} c="primary.0">
      { !gctx.is_mobile_screen && <SessionStatus text_color="primary.0"/> }
    </Box>
  </Group>
}
