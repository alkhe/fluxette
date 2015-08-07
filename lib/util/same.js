// Determine whether two arrays are functionally equivalent
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (left, right) {
	if (left.length !== right.length) {
		return false;
	}
	for (var i in left) {
		if (right.indexOf(left[i]) === -1) {
			return false;
		}
	}
	return true;
};

module.exports = exports["default"];