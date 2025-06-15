import { authenticate } from "../shopify.server";
import db from "../db.server";
import jwt from 'jsonwebtoken';

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  try{
    if (session) {
        await db.session.deleteMany({ where: { shop } });
        var data = {
          "SHOP_NAME": shop,
      }
      var expiresIn = '1h'
      data = JSON.stringify(data);
    
      jwt.sign({ data }, process.env.SECRET_KEY, { expiresIn }, async (error, token) => {
          if (error) {
              console.log(error);
          }
          else {
              await fetch("https://admin.shipdartexpress.com:9445/uninstallShopifyChannel", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "token": token
                  }
              });
              console.log("✅ Shop uninstall api hit to backend API");
              return new Response();
          }
      });
      }
  }catch(error){
    console.log("Webhook Uninstall", error);
  }
  
  return new Response();
};
