import { AppSession, Permission } from "./types"


export const check_permission = (session: AppSession | undefined | null, permissions: Permission[]) => {
  const allow_unauthenticated = permissions.find(p => p.type === "allow_unauthenticated")
  if (allow_unauthenticated) return true

  if (!session) return false
  if (!session.authenticated) return false

  const any_authenticated = permissions.find(p => p.type === "any_authenticated")
  if (any_authenticated) return true

  if (session.user.is_super_user) return true

  return false
}
