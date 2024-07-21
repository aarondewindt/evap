"use client"

import { ReactNode } from "react";
import { useGlobalStateContext } from "../global_state";
import { useCheckPermissions } from "@/server_actions/session/hooks";
import { permissions } from "@/server_actions/session/types";
import { Alert } from "@mantine/core";



export default function Layout({ children }: { children: ReactNode }) {
  const has_admin_permissions = useCheckPermissions([ permissions.any_authenticated ])

  if (has_admin_permissions === null) return <></>
  if (!has_admin_permissions) return <Alert color="red" m="xl" title="Unautherized">You do not have permission to view this page.</Alert>

  return children
}