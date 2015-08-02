import Fluxette from './flux';

import Store from './ware/store';
import Mapware from './ware/mapware';
import select from './ware/select';

import connect from './react/connect';
import link from './react/link';


import { deleteFrom, fluxDispatch } from './util';

export { Fluxette, Store, Mapware, connect, link, select };

export default stores => {
	let flux = new Fluxette(stores);
	return {
		dispatch: ::flux.dispatch,
		hydrate: actions => fluxDispatch(flux, actions),
		state: () => flux.state,
		history: () => flux.history,
		hook: ::flux.hooks.push,
		unhook: fn => { deleteFrom(flux.hooks, fn); }
	};
};
