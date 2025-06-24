import "@shopify/shopify-app-remix/adapters/node";
import { redirect } from "@remix-run/node";
import jwt from 'jsonwebtoken';

import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  DeliveryMethod 
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
      afterAuth: async ({ session, admin, billing, redirect, state }) => {
        console.log("afterauth state 1");
        console.log("✅ afterAuth called for", session);
        console.log("✅ afterAuth called for env file key",  process.env.SECRET_KEY);
        // 🔥 Send shop name to your Flask API
        try {
          var data = {
              "SHOP_NAME": session.shop,
          }
          var expiresIn = '1h'
          data = JSON.stringify(data);
          jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn }, async (error, token) => {
              if (error) {
                  console.log(error);
              }
              else {
                  const response = await fetch("https://admin.shipdartexpress.com:9445/api/channelCustomerMapping/createChannel/store-shop", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                          "token": token
                      }
                  });
                  console.log("✅ Shop sent to backend API", response);
              }
          });
      } catch (error) {
          console.error("❌ Error sending shop to backend:", error);
      }
        return redirect('/exit');
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
