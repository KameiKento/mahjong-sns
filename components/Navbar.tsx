"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface NavbarProps {
  session: Session | null
}

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          麻雀ソーシャル
        </Link>
        <div className="space-x-4">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            ホーム
          </Link>
          <Link
            href="/create"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/create" ? "text-primary" : "text-muted-foreground"
            )}
          >
            問題作成
          </Link>
          {session ? (
            <Button variant="ghost" onClick={handleSignOut}>
              ログアウト
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="ghost">ログイン</Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">テーマ切り替え</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}