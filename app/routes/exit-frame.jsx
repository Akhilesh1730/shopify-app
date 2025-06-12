import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';

const app = createApp(config);

const redirect = Redirect.create(app);