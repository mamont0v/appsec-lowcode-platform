"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from 'react'
import dynamic from 'next/dynamic'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as StaticProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

const queryClient = new QueryClient();

const DynProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
)

function Providers({ children, ...props }: ThemeProviderProps) {
  const NextThemeProvider =
    process.env.NODE_ENV === 'production' ? StaticProvider : DynProvider

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="linear-gradient(to right, white, blue, red)" showSpinner={false} />
      <NextThemeProvider  {...props} attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>{children}</SessionProvider>
      </NextThemeProvider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default Providers;
