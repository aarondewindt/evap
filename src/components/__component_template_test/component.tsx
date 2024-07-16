import { Button, Group, Stack, Text } from "@mantine/core"
import type { ComponentProps } from "./types"
import { ComponentProvider, useComponentContext } from "./context"


export const Component = (props: ComponentProps) => {
  return <ComponentProvider {...props}>
    <ComponentInner/>
  </ComponentProvider>
}

const ComponentInner = ({}: {}) => {
  const ctx = useComponentContext()
  return <Stack>
    <Group>
      <Text>A: {ctx.counter_a}</Text>
      <Text>B: {ctx.counter_b}</Text>
      <Text>C: {ctx.counter_c}</Text>
    </Group>
    <Group>
      <Button onClick={ctx.set_state_a_increased}>A set_state</Button>
      <Button onClick={ctx.set_state_b_increased}>B set_state</Button>
      <Button onClick={ctx.set_state_c_increased}>C set_state</Button>
    </Group>

    <Group>
      <Button onClick={ctx.set_state_a_increased_location}>A set_state location</Button>
      <Button onClick={ctx.set_state_b_increased_location}>B set_state location</Button>
      <Button onClick={ctx.set_state_c_increased_location}>C set_state location</Button>
    </Group>

    <Group>
      <Button onClick={ctx.a_increased}>A set_memory</Button>
      <Button onClick={ctx.b_increased}>B set_persistent</Button>
      <Button onClick={ctx.c_increased}>C set_url_params</Button>
    </Group>

    <Button onClick={ctx.counters_increased}>All</Button>
  </Stack>
}
