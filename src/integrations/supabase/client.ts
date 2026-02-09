import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fzbnkqtwpzeqanxjtyom.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Ym5rcXR3cHplcWFueGp0eW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NDQ0MjEsImV4cCI6MjA4NjIyMDQyMX0.cZKa39G7Ytd-i7IOPH4kNoRMBrdt1eVvAi_dHGz8Ctc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
