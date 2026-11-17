// Supabase Edge Function entry point (Deno).
// Deploy:  supabase functions deploy lead-submit --no-verify-jwt
import { handleLead } from "../_shared/handler.ts";

Deno.serve((req: Request) => handleLead(req, (k) => Deno.env.get(k)));
