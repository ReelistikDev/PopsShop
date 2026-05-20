import twilio from "twilio";

/**
 * Sends the business an SMS with order details.
 * Never throws — returns a result so a Twilio outage doesn't lose a saved order.
 */
export async function sendOrderSms(
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.BUSINESS_PHONE;

  if (!sid || !token || !from || !to) {
    return { ok: false, error: "Twilio is not configured (missing env vars)." };
  }

  try {
    const client = twilio(sid, token);
    await client.messages.create({ body, from, to });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown Twilio error",
    };
  }
}
