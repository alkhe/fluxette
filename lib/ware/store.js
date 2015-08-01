'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _util = require('../util');

exports['default'] = function () {
	var statefn = arguments.length <= 0 || arguments[0] === undefined ? function () {
		return {};
	} : arguments[0];
	var reducers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var state = undefined;
	// Function that takes an action or array of actions
	return function (action) {
		// If no actions, just return state
		if (action !== undefined) {
			// Call the appropriate reducer with the state and the action
			var type = action.type;

			if (type === _util.init) {
				state = statefn(action);
			} else {
				var reducer = reducers[action.type];
				if (reducer) {
					var redux = reducer(action, state);
					if (redux !== undefined) {
						state = redux;
					}
				}
			}
		}
		return state;
	};
};

module.exports = exports['default'];