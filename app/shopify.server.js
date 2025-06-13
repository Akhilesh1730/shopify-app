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
      afterAuth: async ({ session, admin, billing, redirect }) => {
        console.log("afterauth");
        console.log("✅ afterAuth called for", session.shop);
    
        // 🔥 Send shop name to your Flask API
        try {
          await fetch("https://db8b-2401-4900-889e-3461-b459-b22a-f5d8-e8e7.ngrok-free.app/store-shop", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shop: session.shop,
            }),
          });
    
          console.log("✅ Shop sent to backend API");
        } catch (error) {
          console.error("❌ Error sending shop to backend:", error);
        }
    
        // 🔗 Register ORDERS_CREATE webhook
        await shopify.registerWebhooks({
          session,
          webhooks: [
            {
              path: "/webhooks/orders-create",
              topic: "ORDERS_CREATE",
              webhookHandler: async (topic, shop, body) => {
                console.log("📦 Order Created Webhook Triggered");
                const orderData = JSON.parse(body);
                console.log("📝 Order Data:", orderData);
              },
            },
          ],
        });
    
        return redirect(`/exit-iframe?shop=${session.shop}&host=${session.host}`);
      },
    },
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
