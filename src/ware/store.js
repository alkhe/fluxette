import { init } from '../util';

export default function(statefn = () => ({}), reducers = {}) {
	let state;
	// Function that takes an action or array of actions
	return action => {
		// If no actions, just return state
		if (action !== undefined) {
			// Call the appropriate reducer with the state and the action
			let { type } = action;
			if (type === init) {
				state = statefn(action);
			}
			else {
				let reducer = reducers[action.type];
				if (reducer) {
					let redux = reducer(action, state);
					if (redux !== undefined) {
						state = redux;
					}
				}
			}
		}
		return state;
	};
}
