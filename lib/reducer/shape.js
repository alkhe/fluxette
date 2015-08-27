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
			var last = state[i],
			    next = shape[i](last, action);
			if (last !== next) {
				// queue change if different
				changed = true;
				changes[i] = next;
			}
		}
		return changed ? _extends({}, state, changes) : state;
	};
};

module.exports = exports["default"];