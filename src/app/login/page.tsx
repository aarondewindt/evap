"use client"

import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";


export default function Page() {
  return <Button onClick={() => signIn()}>Sign in</Button>
}
