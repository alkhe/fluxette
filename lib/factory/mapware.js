"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var listeners = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	return function (state, actions) {
		if (actions !== undefined) {
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate listener by type
			for (var i = 0; i < actions.length; i++) {
				var action = actions[i];
				var listener = listeners[action.type];
				if (listener) {
					listener(action);
				}
			}
		}
	};
};

module.exports = exports["default"];