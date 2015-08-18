export default shape =>
	(state = {}, action) => {
		let changed = false,
			changes = {};
		for (let i in shape) {
			let last = state[i],
				next = shape[i](last, action);
			if (last !== next) {
				// queue change if different
				changed = true;
				changes[i] = next;
			}
		}
		return changed ? { ...state, ...changes } : state;
	};
