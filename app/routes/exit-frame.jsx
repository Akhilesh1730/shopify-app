import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions"; // Import Redirect correctly

export default function ExitIframe() {
  useEffect(() => {
    // It's good practice to ensure the host is present before proceeding
    const params = new URLSearchParams(window.location.search);
    const host = params.get("host");

    // Replace with your actual API key from your Shopify Partner Dashboard
    const apiKey = "505015e6892ff21b6c433b09af1c7038"; // <<< IMPORTANT: Update this!

    if (!host) {
      console.error("Host parameter is missing in the URL.");
      // Optionally, you might want to display an error message to the user
      // or redirect to a fallback URL if the host is not found.
      return;
    }

    try {
      const app = createApp({
        apiKey: apiKey,
        host: host,
        forceRedirect: true, // This is good for exiting iframes
      });

      const redirect = Redirect.create(app);

      // Construct the full URL for redirection.
      // For security and best practice, consider if 'https://app.shipdartexpress.com'
      // is always the correct destination. If it's dynamic, it should come
      // from a secure source (e.g., your backend).
      const destinationURL = "https://app.shipdartexpress.com";

      redirect.dispatch(Redirect.Action.REMOTE, destinationURL);
    } catch (error) {
      console.error("Shopify App Bridge initialization or redirection failed:", error);
      // Handle errors gracefully, e.g., display a message to the user
      // or provide a manual link to the destination.
    }
  }, []); // The empty dependency array ensures this runs once on mount

  return (
    <div>
      <p>Redirecting you to the application...</p>
      {/* Optionally, provide a manual link for users if automatic redirect fails */}
      <p>If you are not redirected automatically, please click <a href="https://app.shipdartexpress.com">here</a>.</p>
    </div>
  );
}