// app/routes/webhooks/orders-create.jsx
import { json } from "@remix-run/node";
import { shopify } from "../../shopify.server";

export const action = async ({ request }) => {
  // Verify webhook signature here if needed
  const body = await request.text();
  console.log("📦 Order Created Webhook Triggered");
  console.log("📝 Order Data:", body);
  return json({ received: true });
};