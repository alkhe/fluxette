import Fluxette from './flux';
import Store from './store';

import { deleteFrom } from './util';

export { Fluxette, Store };

export default (stores, middleware) => {
	let flux = new Fluxette(stores, middleware);
	return {
		dispatch: ::flux.dispatch,
		state: () => flux.state,
		history: () => flux.history,
		hook: ::flux.hooks.push,
		unhook: fn => { deleteFrom(flux.hooks, fn); },
		connect: ::flux.connect
	};
}
