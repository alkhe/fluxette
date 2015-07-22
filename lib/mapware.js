"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var reducers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	// Function that takes an action or array of actions
	return function (actions) {
		// If no actions, just return them
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the action
			for (var i = 0; i < actions.length; i++) {
				var action = actions[i];
				var reducer = reducers[action.type];
				if (reducer) {
					var redux = reducer(action);
					if (redux !== undefined) {
						actions[i] = redux;
					}
				}
			}
		}
		return actions;
	};
};

module.exports = exports["default"];