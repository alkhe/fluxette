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
			if (val instanceof Object && val.type) {
				into.push(val);
			}
		}
	}
};

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
var writeMethods = function writeMethods(o, arr) {
	// skip constructor
	for (var i = 1; i < arr.length; i++) {
		o[arr[i]] = 0;
	}
};

// Get object mirroring all instance methods of Class
var methods = function methods(Class) {
	var last = Object.__proto__;
	var m = {};
	do {
		writeMethods(m, Object.getOwnPropertyNames(Class.prototype));
	} while ((Class = Class.__proto__) !== last);
	return m;
};

exports.methods = methods;
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