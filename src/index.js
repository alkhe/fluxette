import Flux from './flux';
import Store from './store';

import { deleteFrom } from './util';

export { Flux, Store };

export default (stores, middleware) => {
	let flux = new Flux(stores, middleware);
	return {
		dispatch: ::flux.dispatch,
		state: () => flux.state,
		history: () => flux.history,
		hook: ::flux.hooks.push,
		unhook: fn => { deleteFrom(flux.hooks, fn); },
		connect: ::flux.connect
	};
}
