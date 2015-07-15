'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _vendorLodash = require('../vendor/lodash');

var _vendorLodash2 = _interopRequireDefault(_vendorLodash);

var deriveState = function deriveState(stores) {
	return _vendorLodash2['default'].mapValues(stores, function (store) {
		return store();
	});
};

exports.deriveState = deriveState;
var normalizeArray = _vendorLodash2['default'].flattenDeep;

exports.normalizeArray = normalizeArray;
var callAll = function callAll(iterable) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var fn = _step.value;

			fn.apply(undefined, data);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
};

exports.callAll = callAll;
var callAllObj = function callAllObj(keyIterable) {
	for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		data[_key2 - 1] = arguments[_key2];
	}

	for (var key in keyIterable) {
		keyIterable[key].apply(keyIterable, data);
	}
};

exports.callAllObj = callAllObj;
var listenerKey = Symbol();
exports.listenerKey = listenerKey;