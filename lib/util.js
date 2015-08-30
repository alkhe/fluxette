"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var $normalize = function $normalize(arr, into) {
	for (var i = 0; i < arr.length; i++) {
		var val = arr[i];
		if (val instanceof Array) {
			$normalize(val, into);
		} else {
			if (val instanceof Object) {
				into.push(val);
			}
		}
	}
};

var normalize = function normalize(arr) {
	if (arr instanceof Array) {
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
// Determine whether two arrays are functionally equivalent
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
var middle = function middle(flux, mw, dispatch) {
	return mw.reduceRight(function (next, ware) {
		return ware.call(flux, next);
	}, dispatch);
};
exports.middle = middle;