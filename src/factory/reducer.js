export default (initial = {}, reducers) =>
	(state = initial, action) => {
		// If no actions, just return state
		if (action !== undefined) {
			// Call the appropriate reducer by type
			let reducer = reducers[action.type];
			if (reducer) {
				let redux = reducer(state, action);
				if (redux !== undefined) {
					state = redux;
				}
			}
		}
		return state;
	};
