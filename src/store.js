export default function(state = {}, reducers = {}) {
	// Function that takes an action or array of actions
	return actions => {
		// If no actions, just return state
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the state and the action
			actions.forEach(action => {
				let red = reducers[action.type];
				if (red) {
					state = red(state, action);
				}
			});
		}
		return state;
	};
}
