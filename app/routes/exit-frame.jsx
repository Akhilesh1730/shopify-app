import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions/index.js";

export default function ExitIframe() {
  
  useEffect(() => {
    const host = new URLSearchParams(window.location.search).get("host");
    const app = createApp({
      apiKey: "505015e6892ff21b6c433b09af1c7038",
      host,
      forceRedirect: true,
    });

    const redirect = Redirect.create(app);
    console.log("Hello")
    redirect.dispatch(Redirect.Action.REMOTE, "http://app.shipdartexpress.com");
  }, []);

  return <p>Redirecting...</p>;
}