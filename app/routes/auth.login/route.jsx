import { useState } from "react";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { login, sessionStorage  } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";


export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return { errors, polarisTranslations };
};

// export const action = async ({ request }) => {
//   const url = new URL(request.url);
//   const state = url.searchParams.get("state");
//   console.log("👉 State being sent to login():", state);
   
//   const errors = loginErrorMessage(await login(request));

//   return {
//     errors,
//   };

// };

export const action = async ({ request }) => {
  const url = new URL(request.url);

  // 1. Get YOUR CUSTOM STATE from the URL (e.g., "1234")
  const yourCustomAppState = url.searchParams.get("state");
  console.log("👉 Custom App State in auth/login action:", yourCustomAppState);

  const formData = await request.formData();
  const shop = formData.get("shop");

  // 2. Store your custom state in the session *before* redirecting to Shopify
  // This state will be accessible in afterAuth
  if (yourCustomAppState) {
    await sessionStorage.set("your_custom_app_state_key", yourCustomAppState);
    console.log("👉 Custom App State saved to session:", yourCustomAppState);
  }

  // 3. Call `shopify.login`. `returnTo` can simply be the default success path.
  // We're not relying on query params in `returnTo` for the custom state here.
  const { headers, errors: loginErrors } = await login(request, {
    shop: shop,
    returnTo: "/app", // Standard return path after successful auth
  });

  const errors = loginErrorMessage(loginErrors);

  return json({ errors }, { headers });
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Log in
              </Text>
              <TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors.shop}
              />
              <Button submit>Log in</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}
