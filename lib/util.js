"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var $normalize = function $normalize(arr, into) {
	for (var i = 0; i < arr.length; i++) {
		var val = arr[i];
		if (Array.isArray(val)) {
			$normalize(val, into);
		} else {
			if (val instanceof Object) {
				into.push(val);
			}
		}
	}
};

var normalize = function normalize(arr) {
	if (Array.isArray(arr)) {
		var norm = [];
		$normalize(arr, norm);
		return norm;
	} else {
		return [arr];
	}
};

exports.normalize = normalize;
// Delete object from array
var remove = function remove(array, obj) {
	var index = array.indexOf(obj);
	if (index !== -1) {
		array.splice(index, 1);
	}
};
exports.remove = remove;