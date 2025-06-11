import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function loader({ request }) {
  const { session, admin } = await authenticate.admin(request);
  
  return redirect("https://app.shipdartexpress.com");
}
