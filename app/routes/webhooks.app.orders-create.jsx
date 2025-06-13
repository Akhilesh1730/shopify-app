import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload} = await authenticate.webhook(request);

  console.log(payload);

  return new Response();
};