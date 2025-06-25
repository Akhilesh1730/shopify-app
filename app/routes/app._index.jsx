import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const getShopIdAsync = async () => {
  const response = await fetch(
    "https://admin.shipdartexpress.com:9445/api/channelCustomerMapping/create",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.status === 200) {
    const json = await response.json();
    return json;
  } else {
    throw new Error("API Call Failed");
  }
};

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  // let jwtToken;
  console.log("Loader Data app._index loads", session);

   try {
    const response = await getShopIdAsync();
    console.log("✅ response", response);
    return { sid: '123' }; // replace '123' with response.something if needed
  } catch (error) {
    console.error("❌ Error sending shop to backend:", error);
    return { sid: null };
  }
  
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const buttonRef = useRef(null);
  const [redirectTimer, setRedirectTimer] = useState(false);
  const { sid } = useLoaderData();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );
  console.log("Loader Data app._index loads");
  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  }, [productId, shopify]);

  useEffect(()=>{
    setTimeout(()=>{
      setRedirectTimer(true);
    },1500);
  },[]);

  const handleRedirect = () =>{
    window.parent.location.href = true ? `http://localhost:5173/signin?token=${sid}&shopifyConnect=1` : `https://app.shipdartexpress.com/connect/store?token=${sid}`;
  }


  return (
    <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'start'}}>
          {redirectTimer ? (<div style={{width:'650px', padding:'30px', marginTop:'40px', background:'#e5e5e5', borderRadius:'4px' }}>
            <h2 style={{fontSize:'22px', color:'#000000', marginBottom:'20px', fontStyle:'oblique', fontWeight:'600'}}>Shipdartexpress Redirection</h2>
            <p style={{fontSize:'18px', color:'#6c757d', marginBottom:'20px', fontStyle:'oblique'}}>If you are not automatically redirected or blocked by browser, then please click the "Redirect" button below to continue.</p>
            <div style={{display:"flex", justifyContent:'flex-end'}}>
            <button ref={buttonRef} onClick={handleRedirect} style={{display:'block', cursor:'pointer', border:'none', borderRadius:'4px',padding:'16px 20px', fontWeight:'bold', background:'#000000', color:'#ffffff'}}>
              Redirect to Shipdartexpress
            </button> 
            </div>
          </div>) : <></>}
          <button ref={buttonRef} onClick={handleRedirect} style={{ display: "none" }}>
              Go to external app
          </button>
    </div>
  );
}
