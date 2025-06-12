import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

export default function ExitIframe() {
  console.log("exit");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const host = params.get("host");
    const apiKey = "505015e6892ff21b6c433b09af1c7038"; // Replace with your actual API key

    const app = createApp({
      apiKey,
      host,
      forceRedirect: true,
    });

    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, "https://app.shipdartexpress.com");
  }, []);

  return <p>Redirecting...</p>;
}