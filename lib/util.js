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
	var obj = stores instanceof Array ? [] : {};
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
var updateState = function updateState(stores, previous) {
	for (var _len2 = arguments.length, data = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
		data[_key2 - 2] = arguments[_key2];
	}

	if (stores instanceof Function) {
		stores.apply(undefined, data);
		stores[changedKey] = previous[0] !== stores;
		previous[0] = stores;
	} else {
		awareCall.apply(undefined, [stores, previous[0]].concat(data));
	}
};

exports.updateState = updateState;
var awareCall = function awareCall(iterable, previous) {
	for (var _len3 = arguments.length, data = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
		data[_key3 - 2] = arguments[_key3];
	}

	for (var key in iterable) {
		var fn = iterable[key],
		    prev = previous[key];
		if (fn instanceof Function) {
			fn.apply(undefined, data);
			fn[changedKey] = prev !== fn;
		} else {
			awareCall.apply(undefined, [fn, prev].concat(data));
		}
	}
};

var bootstrap = function bootstrap(stores) {
	return [stores instanceof Function ? anonymous : makeSnapshot(stores)];
};

exports.bootstrap = bootstrap;
var makeSnapshot = function makeSnapshot(stores) {
	var snap = {};
	for (var key in stores) {
		var fn = stores[key];
		snap[key] = fn instanceof Function ? anonymous : makeSnapshot(fn);
	}
	return snap;
};

var anonymous = {};

var changedKey = Symbol ? Symbol() : '__fluxetteChanged';

exports.changedKey = changedKey;
var listenerKey = Symbol ? Symbol() : '__fluxetteListener';

exports.listenerKey = listenerKey;
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};

exports.deleteFrom = deleteFrom;
var shallowEqual = function shallowEqual(a, b) {
	if (a === b) {
		return true;
	} else if (a instanceof Date) {
		return a.getTime() === b.getTime();
	} else {
		var keys = Object.keys(a),
		    _length = keys.length;
		if (_length !== Object.keys(b).length) {
			return false;
		}
		if (_length > 1) {
			return false;
		}
		if (_length == 1) {
			return a[keys[0]] === b[keys[0]];
		}
		return true;
	}
	return false;
};
exports.shallowEqual = shallowEqual;