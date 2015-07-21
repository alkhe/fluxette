import Flux from './flux';
import Store from './store';

export { Flux, Store };

export default (stores, middleware) => {
	let flux = new Flux(stores, middleware);
	return {
		dispatch: ::flux.dispatch,
		state: () => flux.state,
		history: () => flux.history,
		hook: ::flux.hook,
		unhook: ::flux.unhook,
		connect: ::flux.connect
	};
}
