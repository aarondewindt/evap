import { Box, NavLink, Stack, Text } from "@mantine/core"
import { SessionStatus } from "../session_status"
import { useGlobalStateContext } from "@/app/global_state"

import { navmap } from "./navmap"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Navbar = () => {
  const gctx = useGlobalStateContext()
  const pathname = usePathname()
  

  return <Stack justify="space-between" h="100%" p={0}>
    <Box p={0}>
      { navmap.map((navitem) => 
        <NavLink 
          component={Link}
          key={navitem.label} 
          label={navitem.label}
          href={navitem.href} 
          leftSection={navitem.left_section}
          active={navitem.active_pathname_pattern?.test(pathname)}
        />
      )}
    </Box>
    <Box p="md">
      { gctx.is_mobile_screen && <SessionStatus/> }
    </Box>
    
  </Stack>
}
