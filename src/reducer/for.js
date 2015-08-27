export default reducer =>
	(state, actions) => actions.map(a => reducer(state, a));
