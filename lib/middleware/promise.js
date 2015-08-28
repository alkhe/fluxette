"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (next) {
	var _this = this;

	return function (action) {
		return action.then instanceof Function ? action.then(_this.dispatch)["catch"](_this.dispatch) : next(action);
	};
};

module.exports = exports["default"];