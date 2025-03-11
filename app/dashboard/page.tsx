"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>You are logged in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is a protected dashboard page that only authenticated users can access.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">User ID:</span> {user.id}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Last Sign In:</span>{" "}
                {new Date(user.last_sign_in_at || "").toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Method</CardTitle>
            <CardDescription>How you signed in</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You are currently authenticated using{" "}
              <span className="font-medium">{user.app_metadata?.provider || "email/password"}</span>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

