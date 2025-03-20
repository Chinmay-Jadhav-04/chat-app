import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/theme/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import ConvexClientProvider from '@/providers/ConvexClientProvider'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <ConvexClientProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
              <Toaster richColors/>
            </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

