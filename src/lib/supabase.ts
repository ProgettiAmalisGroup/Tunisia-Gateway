import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gwrkwdkshbjgazfzyziq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmt3ZGtzaGJqZ2F6Znp5emlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTg3MjAsImV4cCI6MjA5MTU5NDcyMH0.RyzzRDDKR2C_xo8_y2k-kJPeeDs-d0EHOLgVPmFhCaU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);