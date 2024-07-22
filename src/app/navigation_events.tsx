"use client"

import { useEffect } from "react"
import { useGlobalStateContext } from "./global_state"


export const NavigationEvents = () => {
  const gctx = useGlobalStateContext()

  useEffect(() => {
    gctx.on_nav_toggle(false)
  }, [ gctx.path_name, gctx.search_params ])

  return <></>
}