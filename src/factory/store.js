export default shape =>
	(state = {}, action) => {
		let changed = false,
			changes = {};
		for (let i in shape) {
			let last = state[i];
			let next = shape[i](last, action);
			if (last !== next) {
				changed = true;
				changes[i] = next;
			}
		}
		if (changed) {
			// Overwrite changes onto new reference
			state = { ...state, ...changes };
		}
		return state;
	};
