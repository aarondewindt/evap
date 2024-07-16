import { } from "@mantine/core"
import { useNProgressContext } from "./context"
import { useEffect, useId } from "react"


export const useNProgress = (is_animating: boolean, name?: string) => {
  const id = useId()
  const { start, complete } = useNProgressContext()

  useEffect(() => {
    if (is_animating) {
      start(id)
    } else {
      complete(id)
    }
  }, [is_animating, start, complete, id])

  useEffect(() => {
    return () => {
      complete(id)
    }
  }, [ complete, id ])

  return {}
}
