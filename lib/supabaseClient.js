import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://zcfvtndrfgvznhnmyhbd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZnZ0bmRyZmd2em5obm15aGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM4NjA5NTksImV4cCI6MTk5OTQzNjk1OX0.RucBvNatqLr-cPz4ZW2wzoNEucr8xCkXfMAMDf4weAY"
);
