'use client'

import './globals.css';
import { ReactNode } from 'react';
import ThemeWrapper from './ThemeWrapper';


export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body  cz-shortcut-listen="true">
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
