export default store =>
	(state, action) =>
		(action !== undefined) && (action.type === type)
			? action.state
			: store(state, action);

export let type = '@edge/flux-reducers:HYDRATE';
