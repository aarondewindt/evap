import { Box, NavLink, Stack, Text } from "@mantine/core"
import { SessionStatus } from "../session_status"
import { useGlobalStateContext } from "@/app/global_state"

import { navmap, NavItem } from "./navmap"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Navbar = () => {
  const gctx = useGlobalStateContext()
  
  return <Stack justify="space-between" h="100%" p={0}>
    <Box p={0}>
      { navmap.map((navitem) => 
        <NavbarItem key={navitem.href} navitem={navitem}/>
      )}
    </Box>
    <Box p="md">
      { gctx.is_mobile_screen && <SessionStatus text_color="red"/> }
    </Box>
    
  </Stack>
}


export const NavbarItem = ({ navitem }: { navitem: NavItem}) => {
  const gctx = useGlobalStateContext()
  const pathname = usePathname()

  if (navitem.must_be_authenticated && !gctx.session?.authenticated) return <></>

  return <NavLink component={Link}
                  key={navitem.label} 
                  label={navitem.label}
                  href={navitem.href} 
                  leftSection={navitem.left_section}
                  active={navitem.active_pathname_pattern?.test(pathname)}>
    { navitem.children && navitem.children.map((sub_navitem) => <NavbarItem key={sub_navitem.href} navitem={sub_navitem}/>) }
  </NavLink>
}
