export default function(listeners = {}) {
	return (state, actions) => {
		if (actions !== undefined) {
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate listener by type
			for (let i = 0; i < actions.length; i++) {
				let action = actions[i];
				let listener = listeners[action.type];
				if (listener) {
					listener(action);
				}
			}
		}
	};
}
