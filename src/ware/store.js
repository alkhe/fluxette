import { initType } from '../util';

export default function(statefn = () => ({}), reducers = {}) {
	let state;
	return action => {
		if (action === undefined) {
			if (state === undefined) {
				state = statefn();
			}
			return state;
		}
		else {
			let { type } = action;
			if (type === initType) {
				// Reset the state
				state = statefn(action);
			}
			else {
				if (state === undefined) {
					state = statefn();
				}
				// Call the appropriate reducer with the state and the action
				let reducer = reducers[action.type];
				if (reducer) {
					let redux = reducer(action, state);
					if (redux !== undefined) {
						state = redux;
					}
				}
			}
			return state;
		}
	};
}
