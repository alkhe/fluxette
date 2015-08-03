"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = function (shape) {
	return function (state, action) {
		if (state === undefined) state = {};

		var changed = false,
		    changes = {};
		for (var i in shape) {
			var last = state[i];
			var next = shape[i](last, action);
			if (last !== next) {
				changed = true;
				changes[i] = next;
			}
		}
		if (changed) {
			// Overwrite changes onto new reference
			state = _extends({}, state, changes);
		}
		return state;
	};
};

module.exports = exports["default"];