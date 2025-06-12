   // app/routes/exit-iframe.jsx
   import { useEffect } from "react";

   export default function ExitIframe() {
     useEffect(() => {
       // Try to use App Bridge if available
       if (window.ShopifyAppBridge) {
         const app = window.ShopifyAppBridge.default;
         const actions = window.ShopifyAppBridge.actions;
         const redirect = actions.Redirect.create(app);
         redirect.dispatch(actions.Redirect.Action.REMOTE, "https://app.shpdartexpress.com");
       } else {
         // Fallback: force top-level navigation
         window.top.location.href = "https://app.shpdartexpress.com";
       }
     }, []);

     return <p>Redirecting...</p>;
   }