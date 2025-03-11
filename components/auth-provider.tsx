// "use client"

// import type React from "react"

// import { createContext, useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { supabase } from "@/lib/supabase"
// import type { User } from "@supabase/supabase-js"

// type AuthContextType = {
//   user: User | null
//   loading: boolean
//   signIn: (email: string, password: string) => Promise<{ error: any }>
//   signUp: (email: string, password: string, userData: any) => Promise<{ error: any; user: User | null }>
//   signOut: () => Promise<void>
//   faceSignIn: (faceData: string) => Promise<{ error: any }>
//   updateFaceData: (userId: string, faceData: string) => Promise<{ error: any }>
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signIn: async () => ({ error: null }),
//   signUp: async () => ({ error: null, user: null }),
//   signOut: async () => {},
//   faceSignIn: async () => ({ error: null }),
//   updateFaceData: async () => ({ error: null }),
// })

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null)
//       setLoading(false)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (!error) {
//       router.push("/dashboard")
//     }

//     return { error }
//   }

//   const signUp = async (email: string, password: string, userData: any) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: userData,
//       },
//     })

//     if (!error && data.user) {
//       // Create profile in profiles table
//       const { error: profileError } = await supabase.from("profiles").insert({
//         id: data.user.id,
//         full_name: userData.full_name,
//         avatar_url: userData.avatar_url,
//       })

//       if (!profileError) {
//         router.push("/dashboard")
//       }
//     }

//     return { error, user: data.user }
//   }

//   const signOut = async () => {
//     await supabase.auth.signOut()
//     router.push("/")
//   }

//   const faceSignIn = async (faceData: string) => {
//     // Query the profiles table to find a user with matching face data
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("id, face_descriptor")
//       .not("face_descriptor", "is", null)

//     if (error) {
//       return { error }
//     }

//     // Compare face data with stored face descriptors
//     // This is a simplified example - in a real app, you would use face-api.js to compare descriptors
//     const matchedUser = data.find((profile) => {
//       // In a real implementation, you would compare face descriptors using Euclidean distance
//       return profile.face_descriptor === faceData
//     })

//     if (matchedUser) {
//       // Sign in as the matched user
//       const { error: signInError } = await supabase.auth.signInWithId(matchedUser.id)

//       if (!signInError) {
//         router.push("/dashboard")
//       }

//       return { error: signInError }
//     }

//     return { error: new Error("Face not recognized") }
//   }

//   const updateFaceData = async (userId: string, faceData: string) => {
//     const { error } = await supabase.from("profiles").update({ face_descriptor: faceData }).eq("id", userId)

//     return { error }
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         faceSignIn,
//         updateFaceData,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }















// -----------------------------------------------------------------------















// "use client"

// import React, { createContext, useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { supabase } from "@/lib/supabase"
// import type { User } from "@supabase/supabase-js"

// type AuthContextType = {
//   user: User | null
//   loading: boolean
//   signIn: (email: string, password: string) => Promise<{ error: any }>
//   signUp: (email: string, password: string, userData: any) => Promise<{ error: any; user: User | null }>
//   signOut: () => Promise<void>
//   faceSignIn: (faceData: string) => Promise<{ error: any }>
//   updateFaceData: (userId: string, faceData: string) => Promise<{ error: any }>
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signIn: async () => ({ error: null }),
//   signUp: async () => ({ error: null, user: null }),
//   signOut: async () => {},
//   faceSignIn: async () => ({ error: null }),
//   updateFaceData: async () => ({ error: null }),
// })

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null)
//       setLoading(false)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   // ✅ Email/Password Sign In
//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password })

//     if (!error) {
//       router.push("/dashboard")
//     }

//     return { error }
//   }

//   // ✅ Email/Password Sign Up
//   const signUp = async (email: string, password: string, userData: any) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: userData,
//       },
//     })

//     if (!error && data.user) {
//       // Create profile in profiles table
//       const { error: profileError } = await supabase.from("profiles").insert({
//         id: data.user.id,
//         full_name: userData.full_name,
//         avatar_url: userData.avatar_url,
//       })

//       if (!profileError) {
//         router.push("/dashboard")
//       }
//     }

//     return { error, user: data.user }
//   }

//   // ✅ Sign Out
//   const signOut = async () => {
//     await supabase.auth.signOut()
//     router.push("/")
//   }

//   // ✅ Face Login (Revised)
//   const faceSignIn = async (faceData: string) => {
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("id, face_descriptor, email")
//       .not("face_descriptor", "is", null)

//     if (error) {
//       return { error }
//     }

//     const matchedUser = data.find((profile) => profile.face_descriptor === faceData)

//     if (matchedUser) {
//       // ✅ Use Magic Link to sign in (since signInWithId doesn't exist)
//       const { error: signInError } = await supabase.auth.signInWithOtp({
//         email: matchedUser.email,
//       })

//       if (!signInError) {
//         router.push("/dashboard")
//       }

//       return { error: signInError }
//     }

//     return { error: new Error("Face not recognized") }
//   }

//   // ✅ Update Face Data
//   const updateFaceData = async (userId: string, faceData: string) => {
//     const { error } = await supabase
//       .from("profiles")
//       .update({ face_descriptor: faceData })
//       .eq("id", userId)

//     return { error }
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         faceSignIn,
//         updateFaceData,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }






//-----------------------------------------

"use client"

import React, { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; user: User | null }>
  signOut: () => Promise<void>
  faceSignIn: (faceData: string) => Promise<{ error: any }>
  updateFaceData: (userId: string, faceData: string) => Promise<{ error: any }>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  faceSignIn: async () => ({ error: null }),
  updateFaceData: async () => ({ error: null }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // ✅ Email/Password Sign In
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error) {
      router.push("/dashboard")
    }

    return { error }
  }

  // ✅ Email/Password Sign Up (Stores email in profiles)
  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    if (!error && data.user) {
      // Create profile in profiles table with email
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email, // ✅ Store email in profiles
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
        face_descriptor: userData.face_descriptor || null,
      })

      if (!profileError) {
        router.push("/dashboard")
      }
    }

    return { error, user: data.user }
  }

  // ✅ Sign Out
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  // ✅ Face Login (Find user & log in)
  const faceSignIn = async (faceData: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, face_descriptor, email")
      .not("face_descriptor", "is", null)

    if (error) {
      return { error }
    }

    const matchedUser = data.find((profile) => profile.face_descriptor === faceData)

    if (matchedUser) {
      // ✅ Magic Link Sign In
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: matchedUser.email,
      })

      if (!signInError) {
        router.push("/dashboard")
      }

      return { error: signInError }
    }

    return { error: new Error("Face not recognized") }
  }

  // ✅ Update Face Data
  const updateFaceData = async (userId: string, faceData: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ face_descriptor: faceData })
      .eq("id", userId)

    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        faceSignIn,
        updateFaceData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

