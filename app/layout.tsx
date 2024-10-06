import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from '@/components/Navbar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '麻雀何切る問題',
  description: '麻雀愛好家のためのソーシャルネットワーク',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch (error) {
    console.error('Failed to get session:', error)
  }

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar session={session} />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}