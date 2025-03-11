"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/lib/hooks/use-auth"

export function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Face Auth</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant={pathname === "/profile" ? "default" : "ghost"}>Profile</Button>
              </Link>
              <Link href="/setup">
                <Button variant={pathname === "/setup" ? "default" : "ghost"}>Setup</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant={pathname === "/auth/login" ? "default" : "ghost"}>Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant={pathname === "/auth/signup" ? "default" : "ghost"}>Sign Up</Button>
              </Link>
              <Link href="/setup">
                <Button variant={pathname === "/setup" ? "default" : "ghost"}>Setup</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

