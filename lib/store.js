"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var reducers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	// Function that takes an action or array of actions
	return function (actions) {
		// If no actions, just return state
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the state and the action
			actions.forEach(function (action) {
				var red = reducers[action.type];
				if (red) {
					state = red(state, action);
				}
			});
		}
		return state;
	};
};

module.exports = exports["default"];