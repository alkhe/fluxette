"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (reducer) {
	var partial = function partial(a) {
		return reducer(state, a);
	};
	return function (state, actions) {
		return actions.map(partial);
	};
};

module.exports = exports["default"];