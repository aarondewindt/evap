"use client"
import { Button, Container, Paper, Text, Title } from "@mantine/core";
import { useGlobalStateContext } from "./global_state";

import { hello } from "@/server_actions/hello";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/components/link";


export default function Home() {
  const gctx = useGlobalStateContext()

  const { data } = useQuery({ 
    queryKey: ["hello"], 
    queryFn: async () => {
      return await hello()
    }
  })

  return <Container p={0} mt="xl">
      <Paper bg="gray.2" radius="md" withBorder p="xl">
        <Title order={1} mb="md">Welcome to the SoWee 2024 event planner!!</Title>
        <Button component={Link} href="/volunteers" size="lg" color="dark">Go to the volunteer list</Button>
      </Paper>
  </Container>

  ;
}
