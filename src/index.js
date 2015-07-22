import Fluxette from './flux';
import Store from './store';
import Mapware from './mapware';

import { deleteFrom } from './util';

export { Fluxette, Store, Mapware };

export default stores => {
	let flux = new Fluxette(stores);
	return {
		dispatch: ::flux.dispatch,
		state: () => flux.state,
		history: () => flux.history,
		proxy: ::flux.middleware.push,
		unproxy: fn => { deleteFrom(flux.middleware, fn); },
		hook: ::flux.hooks.push,
		unhook: fn => { deleteFrom(flux.hooks, fn); },
		connect: ::flux.connect
	};
}
