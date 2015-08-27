"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var initial = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var reducers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
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