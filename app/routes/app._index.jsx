import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
// FIX: Corrected import path for Redirect
import { Redirect } from "@shopify/app-bridge/actions/Redirect"; // <--- CHANGE IS HERE
import { authenticate } from "../shopify.server";

// Optional loader to ensure user is authenticated
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function RedirectPage() {
  const app = useAppBridge();

  useEffect(() => {
    // Only proceed if 'app' is a valid App Bridge instance
    if (app && app.dispatch) {
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.REMOTE, "https://app.shipdartexpress.com");
    } else {
      console.warn("App Bridge instance not fully initialized, cannot dispatch redirect.");
      // Fallback for non-embedded scenarios or slow initialization
      // This will open in the current browser tab, not within the Shopify admin iframe
      window.location.href = "https://app.shipdartexpress.com";
    }
  }, [app]); // Dependency array: re-run if 'app' object changes (e.g., after initialization)

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h2 style={{ fontSize: '24px', color: 'gray' }}>Redirecting…</h2>
      <p>If you are not redirected, <a href="https://app.shipdartexpress.com">click here</a>.</p>
    </div>
  );
}