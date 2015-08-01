"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var reducers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	return function (actions) {
		// If no actions, just return them
		if (actions !== undefined) {
			// Call the appropriate reducer with the action
			if (actions instanceof Array) {
				for (var i = 0; i < actions.length; i++) {
					var action = actions[i];
					var reducer = reducers[action.type];
					if (reducer) {
						reducer(action);
					}
				}
			} else {
				var reducer = reducers[actions.type];
				if (reducer) {
					var redux = reducer(actions);
					if (redux !== undefined) {
						actions = redux;
					}
				}
			}
		}
		return actions;
	};
};

module.exports = exports["default"];