export default function(reducers = {}) {
	// Function that takes an action or array of actions
	return actions => {
		// If no actions, just return them
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the action
			for (let i = 0; i < actions.length; i++) {
				let action = actions[i];
				let reducer = reducers[action.type];
				if (reducer) {
					let redux = reducer(action);
					if (redux !== undefined) {
						actions[i] = redux;
					}
				}
			}
		}
		return actions;
	};
}
