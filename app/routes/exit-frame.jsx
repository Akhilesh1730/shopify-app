import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

export default function ExitIframe() {
  useEffect(() => {
    const app = createApp({
      apiKey: "YOUR_API_KEY",
      host: new URLSearchParams(window.location.search).get("host"),
      forceRedirect: true,
    });

    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, "https://your-app.com/app");
  }, []);

  return <p>Redirecting you to the app...</p>;
}
