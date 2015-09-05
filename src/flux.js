import { normalize, remove } from './util';

export default (reducer, state = reducer()) => {
	let hooks = [],
		status = 0;
	return {
		reduce: action => {
			state = reducer(state, action);
			return action;
		},
		using(...middleware) {
			let flux = { ...this };
			flux.reduce = middleware.reduceRight((next, ware) => this::ware(next), flux.reduce);
			flux.dispatch = (actions, call = true) => {
				status++;
				actions = normalize(actions).map(flux.reduce);
				status--;
				if (call && status === 0) {
					for (let i = 0; i < hooks.length; i++) {
						hooks[i](state);
					}
				}
				return actions;
			};
			return flux;
		},
		state: () => state,
		hook: ::hooks.push,
		unhook: fn => { remove(hooks, fn); }
	}.using();
}
