import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
    // --- ADD THIS AUTH CONFIGURATION ---
  auth: {
    path: "/auth", // Matches your authPathPrefix
    callbackPath: "/auth/callback", // Matches your Remix route for auth callback
    afterAuth: async ({ session, admin, request }) => {
      // This hook runs AFTER the app is successfully authenticated and installed.
      // `session` contains shop, accessToken, etc.
      // `admin` is the Shopify API client for the authenticated shop.
      // `request` is the standard Web Fetch API Request object.

      console.log(`App installed/authenticated for shop: ${session.shop}`);

      // --- Define your custom URL here ---
      const CUSTOM_POST_INSTALL_URL = "https://app.shipdartexpress.com";
      // Replace "https://your-custom-render-app-url.com" with your actual custom URL.
      // This is the URL you want the user to land on after installation.

      // For embedded apps, we need to redirect *back to our embedded app URL*
      // but with a special query parameter that signals to the frontend to perform
      // the *final* external redirect using App Bridge.

      const url = new URL(request.url);
      const host = url.searchParams.get("host"); // Get the host from the incoming request URL

      if (!host) {
        console.warn("Host parameter not found in request URL during afterAuth. This might lead to issues with embedded redirects.");
        // Consider adding a fallback or error handling here if 'host' is crucial for your setup
        // and might be missing in certain scenarios.
      }

      // Construct the URL to redirect back to your embedded Remix app.
      // This will cause the iframe to reload with the new URL and parameters.
      const embeddedAppRedirectUrl = new URL(SHOPIFY_APP_URL);
      if (host) {
        embeddedAppRedirectUrl.searchParams.set("host", host);
      }
      embeddedAppRedirectUrl.searchParams.set("shop", session.shop);
      // Add your custom redirect signal to the URL
      embeddedAppRedirectUrl.searchParams.set("custom_redirect_to", encodeURIComponent(CUSTOM_POST_INSTALL_URL));

      console.log(`Server: Redirecting to embedded app with signal: ${embeddedAppRedirectUrl.toString()}`);

      // In Remix loaders/actions, you throw a Response object for redirects.
      // This tells the browser (the iframe) to navigate to the constructed URL.
      throw new Response(null, {
        status: 302, // HTTP 302 Found (temporary redirect)
        headers: {
          Location: embeddedAppRedirectUrl.toString(),
        },
      });
    },
  },
  // --- END ADDED AUTH CONFIGURATION ---
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
