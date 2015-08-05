"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (types, reducer) {
	return function (state, action) {
		return types.indexOf(action.type) !== -1 ? reducer(state, action) : reducer(state);
	};
};

module.exports = exports["default"];