// Flatten array and filter Actions
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var normalize = function normalize(arr) {
	if (arr.length > 0) {
		var norm = [];
		$normalize(arr, norm);
		return norm;
	} else {
		return arr;
	}
};

exports.normalize = normalize;
var $normalize = function $normalize(arr, into) {
	for (var i = 0; i < arr.length; i++) {
		var val = arr[i];
		if (val instanceof Array) {
			$normalize(val, into);
		} else {
			if (val instanceof Object && val.type) {
				into.push(val);
			}
		}
	}
};

// Delete object from array
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (index !== -1) {
		array.splice(index, 1);
	}
};

// Determine whether two arrays are functionally equivalent
exports.deleteFrom = deleteFrom;
var same = function same(left, right) {
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

exports.same = same;
var listenerKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteListener';
exports.listenerKey = listenerKey;