export default class {
	constructor(store = x => x, state) {
		// Store
		this.store = store;
		// Hooks
		this.hooks = [];
		// Action Stack
		this.history = [];
		// State
		this.state = state;
	}
	process(actions, update = true) {
		if (actions.length > 0) {
			// Log all actions in history
			this.history.push(...actions);
			// Synchronously process all actions
			this.state = actions.reduce(this.store, this.state);
			// Call all registered hooks
			if (update) {
				this.update(actions);
			}
		}
	}
	update(actions) {
		let { hooks, state } = this;
		for (let i = 0; i < hooks.length; i++) {
			hooks[i](state, actions);
		}
	}
}
