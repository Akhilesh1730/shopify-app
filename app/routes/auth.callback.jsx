import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function loader({ request }) {
  const { session, admin } = await authenticate.admin(request);

  console.log("✅ OAuth Success - Shop:", session.shop);
  console.log("✅ Access Token:", session.accessToken);

  // ✅ Custom redirect after login
  return redirect(`https://app.shipdartexpress.com`);
}
