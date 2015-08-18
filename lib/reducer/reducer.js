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
				state = reducer(state, action);
			}
		}
		return state;
	};
};

module.exports = exports["default"];