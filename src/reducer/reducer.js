export default (initial = {}, reducers = {}) =>
	(state = initial, action) => {
		// Call the appropriate reducer by type
		if (action !== undefined && action.type in reducers) {
			state = reducers[action.type](state, action);
		}
		return state;
	};
