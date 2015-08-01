import Fluxette from './flux';
import Store from './store';
import Mapware from './mapware';

import connect from './react/connect';
import link from './react/link';

import select from './select';

import { deleteFrom, fluxDispatch } from './util';

export { Fluxette, Store, Mapware, connect, link, select };

export default stores => {
	let flux = new Fluxette(stores);
	return {
		dispatch: ::flux.dispatch,
		hydrate: actions => fluxDispatch(flux, actions),
		state: () => flux.state,
		history: () => flux.history,
		proxy: ::flux.middleware.push,
		unproxy: fn => { deleteFrom(flux.middleware, fn); },
		hook: ::flux.hooks.push,
		unhook: fn => { deleteFrom(flux.hooks, fn); }
	};
};
