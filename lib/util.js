// Dispatch actions to stores
// If it's a store, just dispatch it
// Otherwise recursively dispatch
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var stateCall = function stateCall(store, data) {
	return store instanceof Function ? store(data) : derive(store, data);
};

exports.stateCall = stateCall;
var derive = function derive(stores, data) {
	var obj = stores instanceof Array ? [] : {};
	for (var key in stores) {
		var store = stores[key];
		obj[key] = store instanceof Function ? store(data) : derive(store, data);
	}
	return obj;
};

// Flatten array and filter Objects
var normalizeArray = function normalizeArray(arr) {
	return arr.length ? normalize(arr, []) : arr;
};

exports.normalizeArray = normalizeArray;
var normalize = function normalize(arr, into) {
	for (var i = 0; i < arr.length; i++) {
		var val = arr[i];
		if (val instanceof Array) {
			normalize(val, into);
		} else {
			if (val instanceof Object) {
				into.push(val);
			}
		}
	}
	return into;
};

// Call each in array of functions
var callAll = function callAll(arr) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	for (var i = 0; i < arr.length; i++) {
		arr[i].apply(arr, data);
	}
};

exports.callAll = callAll;
// Delete object from array
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};

exports.deleteFrom = deleteFrom;
//
var waterfall = function waterfall(value, functions) {
	for (var i = 0; i < functions.length; i++) {
		value = functions[i](value);
	}
	return value;
};

exports.waterfall = waterfall;
var isString = function isString(val) {
	return typeof val === 'string' || val instanceof String;
};

exports.isString = isString;
var listenerKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteListener';
exports.listenerKey = listenerKey;