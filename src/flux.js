import { normalize, remove } from './util';

export default (store, initial) => {
	let state, history, buffer,
		hooks = [];

	let flux = {
		init: s => {
			history = [];
			buffer = [];
			state = s !== undefined ? s : store();
		},
		dispatch: (...actions) => {
			actions = normalize(actions);
			if (actions.length > 0) {
				flux.process(actions);
				flux.update();
			}
		},
		process: actions => {
			// Log all actions in history
			history.push(...actions);
			buffer.push(...actions);
			// Synchronously process all actions
			state = actions.reduce(store, state);
		},
		update: () => {
			for (let i = 0; i < hooks.length; i++) {
				hooks[i](state, buffer);
			}
			buffer = [];
		},
		state: () => state,
		history: () => history,
		hook: ::hooks.push,
		unhook: fn => { remove(hooks, fn); }
	}

	flux.init(initial);

	return flux;
}
