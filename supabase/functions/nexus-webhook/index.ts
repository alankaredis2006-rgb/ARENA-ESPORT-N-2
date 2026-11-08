// supabase/functions/nexus-webhook/index.ts
// Handler de webhook pour la passerelle de paiement Nexus Africa Mobile Money
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const NEXUS_WEBHOOK_SECRET = Deno.env.get("NEXUS_WEBHOOK_SECRET") || "whsec_arena_esport_2026_signature";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const signature = req.headers.get("x-nexus-signature");
    const rawBody = await req.text();

    if (!rawBody) {
      return new Response(JSON.stringify({ error: "Empty payload" }), { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Event verification
    if (payload.event === "payment.success") {
      const { reference, amount_fcfa, user_id, provider } = payload.data;

      // Increment balance
      const { error: rpcError } = await supabase.rpc("increment_wallet_balance", {
        user_uuid: user_id,
        amount: amount_fcfa,
      });

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        return new Response(JSON.stringify({ error: rpcError.message }), { status: 500 });
      }

      // Record transaction
      await supabase.from("transactions").upsert({
        user_id: user_id,
        amount_fcfa: amount_fcfa,
        type: "topup",
        status: "success",
        payment_method: provider,
        nexus_transaction_id: reference,
        reference: reference,
      });
    }

    return new Response(JSON.stringify({ status: "processed", received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
