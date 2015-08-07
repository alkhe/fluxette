export default {
	process(actions) {
		// Log all actions in history
		this.history.push(...actions);
		// Synchronously process all actions
		this.state = actions.reduce(this.store, this.state);
	},
	update(actions) {
		let { hooks, state } = this;
		// Call all registered hooks
		for (let i = 0; i < hooks.length; i++) {
			hooks[i](state, actions);
		}
	}
};
