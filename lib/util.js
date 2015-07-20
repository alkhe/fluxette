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
var callAllDeep = function callAllDeep(iterable) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	for (var key in iterable) {
		var fn = iterable[key];
		if (fn instanceof Function) {
			fn.apply(undefined, data);
		} else {
			callAllDeep(fn);
		}
	}
};

var flattenDeep = function flattenDeep(arr) {
	return arr.length ? flatten(arr, []) : arr;
};

exports.flattenDeep = flattenDeep;
var flatten = function flatten(arr, into) {
	for (var i in arr) {
		var val = arr[i];
		if (val instanceof Array) {
			flatten(val, into);
		} else {
			into.push(val);
		}
	}
	return into;
};

// Call each function in an array of functions with data
var callAll = function callAll(iterable) {
	for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		data[_key2 - 1] = arguments[_key2];
	}

	for (var key in iterable) {
		iterable[key].apply(iterable, data);
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
var listenerKey = Symbol ? Symbol() : '__fluxetteListener';
exports.listenerKey = listenerKey;