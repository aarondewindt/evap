import { ReactNode } from "react"
import { IconConfetti, IconHome2, IconUsersGroup } from '@tabler/icons-react';


export type NavItem = {
  label: string
  href: string
  left_section?: ReactNode
  active_pathname_pattern?: RegExp
}

export type NavMap = NavItem[]


export const navmap: NavMap = [
  {
    label: "Home",
    href: "/",
    left_section: <IconHome2 size="1rem" stroke={1.5}/>,
    active_pathname_pattern: /^\/$/
  },
  {
    label: "Events",
    href: "/events",
    left_section: <IconConfetti size="1rem" stroke={1.5}/>,
    active_pathname_pattern: /^\/events/
  },
  {
    label: "Volunteers",
    href: "/volunteers",
    left_section: <IconUsersGroup size="1rem" stroke={1.5}/>,
    active_pathname_pattern: /^\/volunteers/
  },
]