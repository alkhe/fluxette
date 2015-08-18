export default (initial = {}, reducers) =>
	(state = initial, action) => {
		// If no actions, just return state
		if (action !== undefined) {
			// Call the appropriate reducer by type
			let reducer = reducers[action.type];
			if (reducer) {
				state = reducer(state, action);
			}
		}
		return state;
	};
