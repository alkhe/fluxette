import Fluxette from './flux';

import Store from './ware/store';
import Mapware from './ware/mapware';
import select from './ware/select';

import connect from './react/connect';
import link from './react/link';

import { deleteFrom, fluxDispatch, init } from './util';

export { Fluxette, Store, Mapware, connect, link, select, init };

export default (stores, init = true) => {
	let flux = new Fluxette(stores);
	if (init) {
		fluxDispatch(flux, [{ type: init }]);
	}
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
