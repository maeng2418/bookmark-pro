'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const TooltipProvider = dynamic(
  () =>
    import('@bookmark-pro/ui').then((mod) => ({
      default: mod.TooltipProvider,
    })),
  { ssr: false },
)

const Toaster = dynamic(
  () => import('@bookmark-pro/ui').then((mod) => ({ default: mod.Toaster })),
  { ssr: false },
)

const SonnerToaster = dynamic(
  () => import('@bookmark-pro/ui').then((mod) => ({ default: mod.SonnerToaster })),
  { ssr: false },
)

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
