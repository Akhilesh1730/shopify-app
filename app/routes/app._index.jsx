import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions/index.js";
import { authenticate } from "../shopify.server";

// Optional loader to ensure user is authenticated
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function RedirectPage() {
  const app = useAppBridge();

  useEffect(() => {
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, "https://app.shipdartexpress.com");
  }, [app]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ fontSize: '24px', color: 'gray' }}>Redirecting…</h2>
    </div>
  );
}
