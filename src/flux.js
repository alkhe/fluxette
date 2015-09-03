import { normalize, remove, middle } from './util';

export default (store, initial) => {
	let state, history, buffer,
		hooks = [],
		status = 0;

	let reduce = action => {
			history.push(action);
			buffer.push(action);
			state = store(state, action);
		},
		init = s => {
			history = [];
			buffer = [];
			state = s !== undefined ? s : store();
		},
		dispatch = (actions, call = true) => {
			actions = normalize(actions);
			if (actions.length > 0) {
				status++;
				actions.forEach(reduce);
				status--;
			}
			if (call && status === 0) {
				for (let i = 0; i < hooks.length; i++) {
					hooks[i](state, buffer);
				}
				buffer = [];
			}
		};

	init(initial);

	let flux = {
		init, dispatch,
		use: (...middleware) => { reduce = middle(flux, middleware, reduce); },
		state: () => state,
		history: () => history,
		hook: ::hooks.push,
		unhook: fn => { remove(hooks, fn); }
	};
	return flux;
}
