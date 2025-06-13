import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions"; // Correct import path
import { authenticate } from "../shopify.server";

// Optional loader to ensure user is authenticated
export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function RedirectPage() {
  const app = useAppBridge(); // This might not be ready immediately

  useEffect(() => {
    // Only proceed if 'app' is a valid App Bridge instance
    // A simple check like 'app.dispatch' or 'app.host' often works
    // More robust check could involve checking if app.initialized is true (if available in your App Bridge version)
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