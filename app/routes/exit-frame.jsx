import {useNavigate} from '@shopify/app-bridge-react';
function MyComponent() {
  const navigate = useNavigate();

  // Redirect to a custom URL
  useEffect(() => {
    navigate('https://your-custom-url.com/path');
  }, []);

  return null;
}