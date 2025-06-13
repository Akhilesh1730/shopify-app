import { useEffect } from "react";
import createApp from "@shopify/app-bridge";
import { Redirect } from "@shopify/app-bridge/actions/index.js";

export default function ExitIframe() {
  
  useEffect(() => {
    console.log("Checking karna ji");
    window.top.location.href = "https://app.shipdartexpress.com"
  }, []);

  return <p>Redirecting...</p>;
}