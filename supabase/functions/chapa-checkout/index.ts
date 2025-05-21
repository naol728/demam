// supabase/functions/chapa-checkout/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const body = await req.json();

  const { email, amount, first_name, last_name, tx_ref, return_url } = body;

  const res = await fetch("https://api.chapa.co/v1/transaction/initialize", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("CHAPA_SECRET_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount,
      first_name,
      last_name,
      currency: "ETB",
      tx_ref,
      callback_url: return_url,
      return_url,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
