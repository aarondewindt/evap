import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { get_session } from "./actions"
import { useCallback, useMemo } from "react"
import { Permission } from "./types"
import { check_permission } from "./check_permission"
import { useGlobalStateContext } from "@/app/global_state"

export const useSessionQuery = <T extends Record<string, Permission[]>>(permissions?: Permission[], extra_permissions?: T ) => {
  return useQuery({
      queryKey: ["session"], 
      queryFn: async () => {
        return await get_session()
      }
  })
}


export const useCheckPermissions = (permissions: Permission[]) => {
  const gctx = useGlobalStateContext()

  permissions = permissions ?? []

  const has_permission = useMemo(() => {
    return check_permission(gctx.session, permissions)
  }, [ gctx.session, permissions ])

  return has_permission
}
