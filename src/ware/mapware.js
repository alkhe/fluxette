export default function(reducers = {}) {
	return actions => {
		// If no actions, just return them
		if (actions !== undefined) {
			// Call the appropriate reducer with the action
			if (actions instanceof Array) {
				for (let i = 0; i < actions.length; i++) {
					let action = actions[i];
					let reducer = reducers[action.type];
					if (reducer) {
						reducer(action);
					}
				}
			}
			else {
				let reducer = reducers[actions.type];
				if (reducer) {
					let redux = reducer(actions);
					if (redux !== undefined) {
						actions = redux;
					}
				}
			}
		}
		return actions;
	};
}
