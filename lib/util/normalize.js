"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var $norm = function $norm(arr, into) {
	for (var i = 0; i < arr.length; i++) {
		var val = arr[i];
		if (val instanceof Array) {
			$norm(val, into);
		} else {
			if (val instanceof Object && val.type) {
				into.push(val);
			}
		}
	}
};

exports["default"] = function (arr) {
	if (arr.length > 0) {
		var norm = [];
		$norm(arr, norm);
		return norm;
	} else {
		return arr;
	}
};

module.exports = exports["default"];