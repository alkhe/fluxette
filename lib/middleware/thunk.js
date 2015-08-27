"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (next) {
	var _this = this;

	return function (action) {
		return action instanceof Function ? action(_this) : next(action);
	};
};

;
module.exports = exports["default"];