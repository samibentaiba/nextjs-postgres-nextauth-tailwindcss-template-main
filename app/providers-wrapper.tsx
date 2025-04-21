'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { useUser } from '@/context/user';
import { UserProvider } from '@/context/user';

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const userTheme = user?.theme ?? 'system';

  return (
    <UserProvider >
      <ThemeProvider
        attribute="class"
        defaultTheme={userTheme}
        enableSystem
        disableTransitionOnChange
        
      >
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
