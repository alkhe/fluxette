import { normalize, remove, middle } from './util';

export default (store, initial) => {
	let state = initial !== undefined ? initial : store(),
		hooks = [],
		status = 0;

	let reduce = action => {
			state = store(state, action);
			return action;
		},
		dispatch = (actions, call = true) => {
			status++;
			actions = normalize(actions).map(reduce);
			status--;
			if (call && status === 0) {
				for (let i = 0; i < hooks.length; i++) {
					hooks[i](state);
				}
			}
			return actions;
		};

	let flux = {
		dispatch,
		use: (...middleware) => { reduce = middle(flux, middleware, reduce); },
		state: () => state,
		hook: ::hooks.push,
		unhook: fn => { remove(hooks, fn); }
	};
	return flux;
}
