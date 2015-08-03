"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (initial, reducers) {
	if (initial === undefined) initial = {};

	return function (state, action) {
		if (state === undefined) state = initial;

		// If no actions, just return state
		if (action !== undefined) {
			// Call the appropriate reducer by type
			var reducer = reducers[action.type];
			if (reducer) {
				var redux = reducer(state, action);
				if (redux !== undefined) {
					state = redux;
				}
			}
		}
		return state;
	};
};

module.exports = exports["default"];