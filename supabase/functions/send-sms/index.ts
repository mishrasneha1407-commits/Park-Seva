// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime-polyfills";

type SmsRequest = {
  to: string;
  message: string;
};

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE = Deno.env.get("TWILIO_PHONE");

async function sendSmsViaTwilio({ to, message }: SmsRequest) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
    throw new Error("Missing Twilio env vars");
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const body = new URLSearchParams({
    From: TWILIO_PHONE,
    To: to,
    Body: message,
  });

  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: body.toString(),
  });

  const json = await resp.json();
  if (!resp.ok) {
    throw new Error(json?.message || "Twilio send failed");
  }

  return json;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { to, message } = (await req.json()) as SmsRequest;

    if (!to || !message) {
      return new Response(JSON.stringify({ error: "to and message required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await sendSmsViaTwilio({ to, message });

    return new Response(JSON.stringify({ ok: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


