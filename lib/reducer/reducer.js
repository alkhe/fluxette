"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (initial, reducers) {
	if (initial === undefined) initial = {};
	return function (state, action) {
		if (state === undefined) state = initial;

		// Call the appropriate reducer by type
		if (action !== undefined && action.type in reducers) {
			state = reducers[action.type](state, action);
		}
		return state;
	};
};

module.exports = exports["default"];