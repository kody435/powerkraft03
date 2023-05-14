import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://izqznraekloycbpkzomi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cXpucmFla2xveWNicGt6b21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM5ODE5OTksImV4cCI6MTk5OTU1Nzk5OX0.WDt6S6QPfBCFCJxtIWeKayZ2TNW4-whdUAOlyW6XdPs"
);
