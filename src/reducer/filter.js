export default (types, reducer) =>
	(state, action) =>
		types.indexOf(action.type) !== -1
			? reducer(state, action)
			: reducer(state);
