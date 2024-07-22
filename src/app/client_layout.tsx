"use client"

import { GlobalStateProvider } from "./global_state"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/tiptap/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import '@/styles/globals.css';

import { SessionProvider } from "next-auth/react";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NProgressProvider } from "@/utils/use_nprogress/context";
import { NavigationProgress } from "@mantine/nprogress";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from '@mantine/modals';
import { theme } from "@/theme";
import { Suspense, useState } from "react";
import { NavigationEvents } from "./navigation_events";


type ClientLayoutProps = {
  children: React.ReactNode;
};


export function ClientLayout({ children }: ClientLayoutProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <GlobalStateProvider>
              <NavigationProgress color='gray.0'/>
              <Suspense fallback={null}>
                <NavigationEvents/>
              </Suspense>
              <NProgressProvider>
                {children}
              </NProgressProvider>
            </GlobalStateProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
    

  );
}
