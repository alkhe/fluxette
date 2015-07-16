'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vendorLodash = require('../vendor/lodash');

var _vendorLodash2 = _interopRequireDefault(_vendorLodash);

var deriveState = function deriveState(stores) {
	var obj = {};
	for (var key in stores) {
		obj[key] = stores[key]();
	}
	return obj;
};

exports.deriveState = deriveState;
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
var listenerKey = Symbol ? Symbol() : '__fluxetteListener';

exports.listenerKey = listenerKey;
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};
exports.deleteFrom = deleteFrom;