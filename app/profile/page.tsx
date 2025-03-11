"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaceCapture } from "@/components/face-capture"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  face_descriptor: string | null
}

export default function ProfilePage() {
  const { user, loading, updateFaceData } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }

    if (user) {
      fetchProfile()
    }
  }, [user, loading, router])

  const fetchProfile = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        throw error
      }

      setProfile(data)
      setFullName(data.full_name || "")
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error fetching profile",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFaceCapture = async (faceDescriptor: Float32Array) => {
    if (!user) return

    setIsSaving(true)

    try {
      // Convert Float32Array to string for storage
      const faceData = Array.from(faceDescriptor).toString()

      const { error } = await updateFaceData(user.id, faceData)

      if (error) {
        throw error
      }

      toast({
        title: "Face data updated",
        description: "Your face data has been updated successfully",
      })

      // Refresh profile data
      fetchProfile()
    } catch (error) {
      console.error("Error updating face data:", error)
      toast({
        title: "Error updating face data",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </CardHeader>
          <form onSubmit={updateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ""} disabled />
                <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Face Authentication</CardTitle>
            <CardDescription>
              {profile.face_descriptor
                ? "Update your face data for authentication"
                : "Set up face authentication for easier login"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FaceCapture
              onCapture={handleFaceCapture}
              buttonText={profile.face_descriptor ? "Update Face Data" : "Set Up Face Authentication"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

