// app/routes/webhooks.jsx
import { json } from "@remix-run/node";
import crypto from "crypto";

async function verifyShopifyWebhook(request, secret) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader) return false;

  const body = await request.text();
  const digest = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");
 
  const valid =
    Buffer.from(digest).length === Buffer.from(hmacHeader).length &&
    crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  return valid ? body : false;
}

export const action = async ({ request }) => {
  const secret = process.env.SHOPIFY_API_SECRET; // Set this in your environment

  const body = await verifyShopifyWebhook(request, secret);

  if (!body) {
    return new Response("Unauthorized", { status: 401 });
  }


  console.log("Compliance webhook received:", body);

  // Always respond with 200 if valid
  return json({ received: true });
};

export const loader = () => new Response("Not found", { status: 404 });