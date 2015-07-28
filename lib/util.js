'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var fluxDispatch = function fluxDispatch(flux, actions) {
	var _flux$history;

	// Push all actions onto stack
	(_flux$history = flux.history).push.apply(_flux$history, _toConsumableArray(actions));
	// Synchronously process all actions
	atomicDispatch(flux.vector, actions);
	// Derive state
	flux.state = derive(flux.stores);
	// Call all registered listeners
	callAll(flux.hooks, actions, flux.state);
};

// Flatten a Store into an array
exports.fluxDispatch = fluxDispatch;
var vectorize = function vectorize(store) {
	if (store instanceof Function) {
		return [store];
	} else {
		var norm = [];
		$vectorize(store, norm);
		return norm;
	}
};

exports.vectorize = vectorize;
var $vectorize = function $vectorize(obj, into) {
	for (var i in obj) {
		var store = obj[i];
		if (store instanceof Function) {
			into.push(store);
		} else {
			$vectorize(store, into);
		}
	}
};

// Derive state from stores
// If it's a store, just get its state
// Otherwise recursively derive
var derive = function derive(store) {
	return store instanceof Function ? store() : $derive(store);
};

exports.derive = derive;
var $derive = function $derive(stores) {
	var obj = stores instanceof Array ? [] : {};
	for (var key in stores) {
		var store = stores[key];
		obj[key] = store instanceof Function ? store() : $derive(store);
	}
	return obj;
};

// Flatten array and filter Objects
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

// Call each action in order with Store vector
var atomicDispatch = function atomicDispatch(vector, actions) {
	for (var i = 0; i < actions.length; i++) {
		var action = actions[i];
		for (var j = 0; j < vector.length; j++) {
			vector[j](action);
		}
	}
};

// Call each in array of functions
exports.atomicDispatch = atomicDispatch;
var callAll = function callAll(arr) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	for (var i = 0; i < arr.length; i++) {
		arr[i].apply(arr, data);
	}
};

// Delete object from array
exports.callAll = callAll;
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};

// Waterfall an array of functions
exports.deleteFrom = deleteFrom;
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
var willUnmountKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteWillUnmount';
exports.willUnmountKey = willUnmountKey;