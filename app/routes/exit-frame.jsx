import { useNavigate } from '@shopify/app-bridge-react';

function MyComponent() {
  const navigate = useNavigate();
  console.log("navigate");
  // Redirect to a custom URL
  useEffect(() => {
    navigate('https://app.shipdartexpress.com');
  }, []);

  return null;
}