// app/routes/exit-iframe.jsx
import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from '@shopify/app-bridge/actions/Redirect'

export default function ExitIframe() {
  useEffect(() => {
    const app = createApp({
      apiKey: '505015e6892ff21b6c433b09af1c7038',
      host: new URLSearchParams(window.location.search).get('host'),
      forceRedirect: true,
    });

    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, 'https://app.shipdartexpress.com');
  }, []);

  return <p>Redirecting...</p>;
}
