import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  console.log("shop", shop);
  if (!shop) {
    // If no shop param is present, redirect to your app listing or error page
    console.log("No shop found");
    return redirect("https://apps.shopify.com/your-app-handle");
  }

  // This starts the Shopify OAuth install flow
  return authenticate.admin(request);
};
