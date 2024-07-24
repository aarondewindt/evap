import { ReactNode } from "react"
import { IconConfetti, IconHome2, IconMapPin, IconSettings, IconUsersGroup } from '@tabler/icons-react';


export type NavItem = {
  label: string
  href: string
  left_section?: ReactNode
  active_pathname_pattern?: RegExp
  must_be_authenticated?: boolean
  children?: NavItem[]
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
    active_pathname_pattern: /^\/events/,
    must_be_authenticated: true
  },
  {
    label: "Volunteers",
    href: "/volunteers",
    left_section: <IconUsersGroup size="1rem" stroke={1.5}/>,
    active_pathname_pattern: /^\/volunteers/
  },
  {
    label: "Locations",
    href: "/locations",
    left_section: <IconMapPin size="1rem" stroke={1.5}/>,
    active_pathname_pattern: /^\/locations/,
    must_be_authenticated: true
  },
  {
    label: "Admin",
    href: "/admin",
    left_section: <IconSettings size="1rem" stroke={1.5}/>,
    active_pathname_pattern: /^\/admin/,
    must_be_authenticated: true,
    children: [
      {
        label: "Users",
        href: "/admin/users",
        active_pathname_pattern: /^\/admin\/users/
      },
      {
        label: "Volunteers",
        href: "/admin/volunteers",
        active_pathname_pattern: /^\/admin\/volunteers/
      }
    ]
  }
]