// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { EvapAppShell } from './app_shell';
import { GlobalStateProvider } from './global_state';
import { ClientLayout } from './client_layout';
import { theme } from '@/theme';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ClientLayout>
          <EvapAppShell>
            {children}
          </EvapAppShell>  
        </ClientLayout> 
      </body>
    </html>
  );
}