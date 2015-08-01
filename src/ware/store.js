export default function(state = {}, reducers = {}) {
	// Function that takes an action or array of actions
	return action => {
		// If no actions, just return state
		if (action !== undefined) {
			// Call the appropriate reducer with the state and the action
			let reducer = reducers[action.type];
			if (reducer) {
				let redux = reducer(action, state);
				if (redux !== undefined) {
					state = redux;
				}
			}
		}
		return state;
	};
}
