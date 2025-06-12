import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: '505015e6892ff21b6c433b09af1c7038',
  host: new URLSearchParams(location.search).get('host'),
  forceRedirect: true,
});

const redirect = Redirect.create(app);

// Redirect to a custom URL
redirect.dispatch(Redirect.Action.REMOTE, 'https://your-custom-url.com/path');