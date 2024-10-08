import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { get_session } from "./actions"
import { useCallback, useMemo } from "react"
import { Permission } from "./types"
import { check_permission } from "./check_permission"
import { useGlobalStateContext } from "@/app/global_state"

export const useSessionQuery = () => {
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
    if (gctx.is_session_fetching) return null
    return check_permission(gctx.session, permissions)
  }, [ gctx.session, permissions, gctx.is_session_fetching ])

  return has_permission
}
