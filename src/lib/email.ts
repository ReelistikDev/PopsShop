import { Resend } from "resend";
import { site } from "@/data/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// "From" must be on a Resend-verified domain (e.g. lbswoodcrafts.com w/ SPF+DKIM);
// customer replies route to the shop owner's inbox via Reply-To.
const FROM = process.env.EMAIL_FROM ?? "LB's Wood-Crafts <orders@lbswoodcrafts.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? site.contactEmail;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}`
  : "https://lbswoodcrafts.com";

export async function sendPaymentEmail(order: {
  customer_name: string;
  email: string;
  product: string | null;
  category: string | null;
  quote_amount: number | null;
  deposit_amount: number | null;
  payment_token: string;
}) {
  if (!resend) return;

  const payUrl = `${SITE_URL}/pay/${order.payment_token}`;
  const piece = order.product || order.category || "your custom piece";
  const quoteStr = order.quote_amount
    ? `$${order.quote_amount.toLocaleString()}`
    : "to be confirmed";
  const depositStr = order.deposit_amount
    ? `$${order.deposit_amount.toLocaleString()}`
    : null;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;background:#f6efe2;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8dcc8;">
    <div style="background:#1a1009;padding:24px 32px;">
      <p style="margin:0;font-size:20px;font-weight:bold;color:#f6efe2;letter-spacing:0.5px;">LB's Wood-Crafts</p>
      <p style="margin:4px 0 0;font-size:13px;color:#d8c3a2;">Handmade, Made-to-Order Woodwork · Camden, SC</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 8px;font-size:17px;font-weight:bold;color:#1a1009;">Hi ${order.customer_name},</p>
      <p style="margin:0 0 20px;font-size:15px;color:#3a2a1d;line-height:1.6;">
        Your order for <strong>${piece}</strong> has been reviewed and is ready for payment.
        ${order.quote_amount ? `The total quote is <strong>${quoteStr}</strong>.` : ""}
      </p>

      ${
        depositStr
          ? `
      <div style="background:#f6efe2;border-radius:8px;padding:16px 20px;margin:0 0 20px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;color:#8a5a32;">Payment Options</p>
        <p style="margin:0;font-size:14px;color:#3a2a1d;">• Pay a deposit of <strong>${depositStr}</strong> now, with the balance due on completion</p>
        <p style="margin:6px 0 0;font-size:14px;color:#3a2a1d;">• Pay the full amount of <strong>${quoteStr}</strong> upfront</p>
      </div>
      `
          : ""
      }

      <a href="${payUrl}" style="display:inline-block;background:#8a5a32;color:#f6efe2;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:bold;margin:0 0 24px;">
        Make Payment →
      </a>

      <p style="margin:0;font-size:13px;color:#8a7a6a;line-height:1.6;">
        Questions? Reply to this email or call/text Lenwood directly.<br/>
        We appreciate your business!
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: order.email,
    subject: `Your LB's Wood-Crafts order is ready for payment`,
    html,
  });
}

/**
 * Notifies the shop owner of a new custom-order request, sent to
 * site.contactEmail (landbeasl@live.com). Reply-To is the customer's own
 * email so the owner can reply straight back to them. Never throws — returns
 * a status so the caller can record it without losing the saved order.
 */
export async function sendOrderNotification(order: {
  customerName: string;
  phone: string;
  email?: string | null;
  category?: string | null;
  product?: string | null;
  dimensions?: string | null;
  woodType?: string | null;
  finish?: string | null;
  quantity?: string | null;
  budget?: string | null;
  deadline?: string | null;
  notes?: string | null;
  photoUrl?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY not set" };

  const rows = (
    [
      ["Name", order.customerName],
      ["Phone", order.phone],
      ["Email", order.email],
      ["Category", order.category],
      ["Product", order.product],
      ["Dimensions", order.dimensions],
      ["Wood", order.woodType],
      ["Finish / Color", order.finish],
      ["Quantity", order.quantity],
      ["Budget", order.budget],
      ["Needed by", order.deadline],
      ["Notes", order.notes],
    ] as Array<[string, string | null | undefined]>
  ).filter(([, v]) => v && String(v).trim()) as Array<[string, string]>;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const rowHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-size:13px;color:#8a5a32;font-weight:bold;white-space:nowrap;vertical-align:top;">${esc(
          label
        )}</td><td style="padding:6px 12px;font-size:14px;color:#1a1009;">${esc(
          value
        ).replace(/\n/g, "<br/>")}</td></tr>`
    )
    .join("");

  const photoHtml = order.photoUrl
    ? `<p style="margin:16px 0 0;font-size:14px;"><a href="${order.photoUrl}" style="color:#8a5a32;">View attached inspiration photo →</a></p>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;background:#f6efe2;margin:0;padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e8dcc8;">
    <div style="background:#1a1009;padding:24px 32px;">
      <p style="margin:0;font-size:20px;font-weight:bold;color:#f6efe2;letter-spacing:0.5px;">🪵 New Custom Request</p>
      <p style="margin:4px 0 0;font-size:13px;color:#d8c3a2;">LB's Wood-Crafts · Camden, SC</p>
    </div>
    <div style="padding:24px 20px;">
      <table style="width:100%;border-collapse:collapse;">${rowHtml}</table>
      ${photoHtml}
      <p style="margin:20px 0 0;font-size:13px;color:#8a7a6a;">
        Reply to this email to respond directly to the customer.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text =
    `New custom request — LB's Wood-Crafts\n\n` +
    rows.map(([label, value]) => `${label}: ${value}`).join("\n") +
    (order.photoUrl ? `\nPhoto: ${order.photoUrl}` : "");

  try {
    await resend.emails.send({
      from: FROM,
      // Reply goes to the customer (if they gave an email), else the shop inbox.
      replyTo: order.email || REPLY_TO,
      to: site.contactEmail,
      subject: `New custom request — ${order.customerName}`,
      html,
      text,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
