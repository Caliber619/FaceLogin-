"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaceCapture } from "@/components/face-capture"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const { signUp, updateFaceData } = useAuth()
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Convert face descriptor to string for storage if available
      // const faceData = faceDescriptor ? Array.from(faceDescriptor).toString() : null
      const faceData = faceDescriptor ? JSON.stringify(Array.from(faceDescriptor)) : null;


      const { error, user } = await signUp(email, password, {
        full_name: fullName,
        face_descriptor: faceData,
      })

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account created",
          description: "Welcome to our platform!",
        })

        // If face data wasn't included in signup, update it separately
        if (user && faceDescriptor && !faceData) {
          const faceDataString = Array.from(faceDescriptor).toString()
          await updateFaceData(user.id, faceDataString)
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFaceCapture = (descriptor: Float32Array) => {
    setFaceDescriptor(descriptor)
    toast({
      title: "Face captured",
      description: "Your face data has been captured successfully",
    })
    setActiveTab("details")
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to create a new account</CardDescription>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Account Details</TabsTrigger>
            <TabsTrigger value="face">Face Setup</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  {faceDescriptor ? (
                    <div className="text-sm text-green-600 dark:text-green-400">Face data captured successfully ✓</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Face data not captured yet. Go to the Face Setup tab to capture your face.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                    Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="face">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Position your face in the center of the camera and click the button to capture your face data for login.
              </p>
              <FaceCapture onCapture={handleFaceCapture} buttonText="Capture Face Data" />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => setActiveTab("details")} className="w-full">
                Back to Account Details
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

