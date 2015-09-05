"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	return function (state, action) {
		if (state === undefined) state = [];
		return state.concat(action);
	};
};

module.exports = exports["default"];