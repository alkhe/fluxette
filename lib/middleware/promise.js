"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (next) {
	return function (action) {
		return action.then instanceof Function ? action : next(action);
	};
};

module.exports = exports["default"];