import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: RootLayoutProps) {
  // console.log('Root Layout mounted or re-rendered')

  return (
    <html
      className="deep-dark"
      lang="en"
      data-theme="deep-dark"
      style={{ colorScheme: 'deep-dark' }}
      suppressHydrationWarning
    >
      <head />
      <body className={inter.className}>
        <ThemeProvider
          themes={['dark', 'light']}
          defaultTheme="system"
          enableSystem
          // forcedTheme={forceDarkMode ? 'dark' : undefined}
        >
          <div vaul-drawer-wrapper="">
            <div className="relative flex min-h-screen flex-col bg-background">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
