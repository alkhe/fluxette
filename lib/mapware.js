"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var reducers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	// Function that takes an action or array of actions
	return function (action) {
		// If no actions, just return them
		if (action !== undefined) {
			// Call the appropriate reducer with the action
			var reducer = reducers[action.type];
			if (reducer) {
				var redux = reducer(action);
				if (redux !== undefined) {
					action = redux;
				}
			}
		}
		return action;
	};
};

module.exports = exports["default"];