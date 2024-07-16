"use client"
import { Paper, Text } from "@mantine/core";
import { useGlobalStateContext } from "./global_state";

import { hello } from "@/server_actions/hello";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";


export default function Home() {
  const gctx = useGlobalStateContext()

  const { data } = useQuery({ 
    queryKey: ["hello"], 
    queryFn: async () => {
      return await hello()
    }
  })

  return <Paper>
    <Text c="grape">Home</Text>
    <Text c="grape">
      {gctx.state.other.is_mobile_screen ? "mobile" : "desktop"}
    </Text>

    <Text ff="monospace">
      { JSON.stringify(data) }
    </Text>

  </Paper>
  ;
}
