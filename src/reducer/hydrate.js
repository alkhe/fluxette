let Hydrate = store =>
	(state, action) =>
		(action !== undefined) && (action.type === Hydrate.type)
			? action.state
			: store(state, action);

Hydrate.type = '@edge/flux-reducers:HYDRATE';

export default Hydrate;
