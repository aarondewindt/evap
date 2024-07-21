
export type AppSession = {
  authenticated: false
} | {
  authenticated: true
  user: {
    name: string
    email: string | null
    image: string | null
    is_superuser: boolean
  }
}

export type PermissionAllowUnauthenticated = {
  type: "allow_unauthenticated"
}

export type PermissionAnyAuthenticated = {
  type: "any_authenticated"
}

export type Permission = PermissionAllowUnauthenticated | PermissionAnyAuthenticated


export const permissions = {
  allow_unauthenticated: { type: "allow_unauthenticated" } as PermissionAllowUnauthenticated,
  any_authenticated: { type: "any_authenticated" } as PermissionAnyAuthenticated,
}
