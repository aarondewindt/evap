
import { } from "@mantine/core"
import type { ComponentProps } from "./types"
import { ComponentProvider, useComponentContext } from "./context"


export const Component = (props: ComponentProps) => {
  return <ComponentProvider {...props}>
    <ComponentInner/>
  </ComponentProvider>
}

const ComponentInner = ({}: {}) => {
  const ctx = useComponentContext()
  return <></>
}
