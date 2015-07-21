// Derive state from stores
// If it's a store, return the result
// Otherwise recursively build a state
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var deriveState = function deriveState(state) {
	return state instanceof Function ? state() : getState(state);
};

exports.deriveState = deriveState;
var getState = function getState(stores) {
	var obj = stores instanceof Array ? [] : {};
	for (var key in stores) {
		var store = stores[key];
		obj[key] = store instanceof Function ? store() : getState(store);
	}
	return obj;
};

// Dispatch actions to stores
// If it's a store, just dispatch it
// Otherwise recursively dispatch
var updateState = function updateState(store, data) {
	if (store instanceof Function) {
		store(data);
	} else {
		callAllDeep(store, data);
	}
};

exports.updateState = updateState;
var callAllDeep = function callAllDeep(iterable, data) {
	for (var key in iterable) {
		var fn = iterable[key];
		if (fn instanceof Function) {
			fn(data);
		} else {
			callAllDeep(fn);
		}
	}
};

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

// Call each function in an array of functions with data
var callAll = function callAll(arr, data) {
	for (var i = 0; i < arr.length; i++) {
		arr[i](data);
	}
};

exports.callAll = callAll;
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};

exports.deleteFrom = deleteFrom;
var isString = function isString(val) {
	return typeof val === 'string' || val instanceof String;
};

exports.isString = isString;
var listenerKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteListener';
exports.listenerKey = listenerKey;