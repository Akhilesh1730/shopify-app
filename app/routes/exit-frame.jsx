// app/routes/exit-iframe.jsx
import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions/index.js";

export default function ExitIframe() {
  useEffect(() => {
    const app = createApp({
      apiKey: '',
      host: new URLSearchParams(window.location.search).get('host'),
      forceRedirect: true,
    });

    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, 'https://your-custom-url.com/path');
  }, []);

  return <p>Redirecting...</p>;
}
