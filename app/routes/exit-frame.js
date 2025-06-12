import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions";

export default function AppRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const config = {
        apiKey: "505015e6892ff21b6c433b09af1c7038",
        host: new URLSearchParams(window.location.search).get("host"),
        forceRedirect: true,
      };

      const app = createApp(config);
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.REMOTE, "http://app.shipdartexpress.com");
    }
  }, []);

  return null;
}
