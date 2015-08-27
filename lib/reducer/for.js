"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (reducer) {
	return function (state, actions) {
		return actions.map(function (a) {
			return reducer(state, a);
		});
	};
};

module.exports = exports["default"];