
import { createClient } from '@supabase/supabase-js'

// but keep these in .local.env file to avoid leaking secrets
const supabaseUrl = 'https://kdlfnnthuvqwdyelcudt.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkbGZubnRodXZxd2R5ZWxjdWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDA5ODUsImV4cCI6MjA3MjExNjk4NX0.OXXXgk8Is2_O7ClukFNuctPoHAnuZVDVZjAkVPox-94"

export const supabase = createClient(supabaseUrl, supabaseKey)