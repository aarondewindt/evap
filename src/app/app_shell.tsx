"use client"
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useGlobalStateContext } from "./global_state"
import { Navbar } from '@/components/navbar';
import { Header } from '@/components/header';


type AppShellProps = {
  children: React.ReactNode;
};


export function EvapAppShell({ children }: AppShellProps) {
  const gctx = useGlobalStateContext()

  return (
      <AppShell
        header={{ height: 45 }}
        navbar={{ 
          width: 150, 
          breakpoint: 'sm', 
          collapsed: { mobile: !gctx.is_nav_open } 
        }}
        padding={0}
      >
        <AppShell.Header style={{backgroundColor: "var(--mantine-color-red-6)"}}>
          <Header/>
        </AppShell.Header>
        <AppShell.Navbar>
          <Navbar/>
        </AppShell.Navbar>
        <AppShell.Main>
          {children}
        </AppShell.Main>
      </AppShell>    
  );
}
