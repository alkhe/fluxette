'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vendorLodash = require('../vendor/lodash');

var _vendorLodash2 = _interopRequireDefault(_vendorLodash);

var deriveState = function deriveState(state) {
	return state instanceof Function ? state() : getState(state);
};

exports.deriveState = deriveState;
var getState = function getState(stores) {
	var obj = {};
	for (var key in stores) {
		var store = stores[key];
		obj[key] = store instanceof Function ? store() : getState(store);
	}
	return obj;
};

var normalizeArray = _vendorLodash2['default'].flattenDeep;

exports.normalizeArray = normalizeArray;
var callAll = function callAll(iterable) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	for (var key in iterable) {
		iterable[key].apply(iterable, data);
	}
};

exports.callAll = callAll;
var callAllDeep = function callAllDeep(iterable) {
	for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		data[_key2 - 1] = arguments[_key2];
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

exports.callAllDeep = callAllDeep;
var listenerKey = Symbol ? Symbol() : '__fluxetteListener';

exports.listenerKey = listenerKey;
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};
exports.deleteFrom = deleteFrom;