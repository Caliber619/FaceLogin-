import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
//const supabaseUrl = "https://wiruarxgzzxcwnwgmxfd.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcnVhcnhnenp4Y3dud2dteGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2ODc4MTEsImV4cCI6MjA1NzI2MzgxMX0.JIHaodoaNUx7Y18ERjpyWNaIDrlyl-N-J-hd1v0QNWo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

