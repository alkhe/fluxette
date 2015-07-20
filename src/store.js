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
			for (let i = 0; i < actions.length; i++) {
				let action = actions[i];
				let reducer = reducers[action.type];
				if (reducer) {
					state = reducer(state, action);
				}
			}
		}
		return state;
	};
}
