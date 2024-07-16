import type { ReactNode } from 'react'

export type HookArgs = {
  is_animating: boolean
  name?: string
}

export type Memory = {
  animating_hooks: string[]
}

export const init_memory: Memory = {
  animating_hooks: []
}
