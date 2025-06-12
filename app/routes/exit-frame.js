import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions/index.js';

const app = createApp(config);

const redirect = Redirect.create(app);
redirect.dispatch(Redirect.Action.REMOTE, 'http://app.shipdartexpress.com');