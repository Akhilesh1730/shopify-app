import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions/index.js";
import { useLocation } from "@remix-run/react";

export default function MyRedirectComponent() {
  const app = useAppBridge();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const host = searchParams.get("host");

    if (host && app) {
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.REMOTE, "https://your-app.com/dashboard");
    }
  }, [app, location]);

  return null;
}
