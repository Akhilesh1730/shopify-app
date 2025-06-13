import "@shopify/shopify-app-remix/adapters/node";
import { redirect } from "@remix-run/node";
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
    hooks: {
      async afterAuth(request, response) {
        console.log('afterAuth hook triggered');
        // Extract shop and host from query parameters or session for embedded app context
        const shop = request.query.shop || (request.session && request.session.shop);
        const host = request.query.host || (request.session && request.session.host);
        // Define your custom path inside your app
        const customPath = '/custom-path'; // Replace with your desired internal route
        // Construct the full redirect URL on your app domain
        // Replace 'https://your-app-domain.com' with your actual app domain
        let redirectToUrl = `https://app.shipdartexpress.com`;
        // Append shop and host as query parameters if available (important for embedded apps)
        if (shop && host) {
          const url = new URL(redirectToUrl);
          url.searchParams.set('shop', shop);
          url.searchParams.set('host', host);
          redirectToUrl = url.toString();
        }
        console.log(`Redirecting to: ${redirectToUrl}`);
        // Redirect user to the constructed URL
        return response.redirect(redirectToUrl);
      },
    }
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
