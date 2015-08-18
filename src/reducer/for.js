export default reducer => {
	let partial = a => reducer(state, a);
	return (state, actions) => actions.map(partial);
}
