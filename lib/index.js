'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _flux = require('./flux');

var _flux2 = _interopRequireDefault(_flux);

var _factoryStore = require('./factory/store');

var _factoryStore2 = _interopRequireDefault(_factoryStore);

var _factoryReducer = require('./factory/reducer');

var _factoryReducer2 = _interopRequireDefault(_factoryReducer);

var _factoryFilter = require('./factory/filter');

var _factoryFilter2 = _interopRequireDefault(_factoryFilter);

var _factoryMapware = require('./factory/mapware');

var _factoryMapware2 = _interopRequireDefault(_factoryMapware);

var _factorySelect = require('./factory/select');

var _factorySelect2 = _interopRequireDefault(_factorySelect);

var _middlewareNormalize = require('./middleware/normalize');

var _middlewareNormalize2 = _interopRequireDefault(_middlewareNormalize);

var _reactContext = require('./react/context');

var _reactContext2 = _interopRequireDefault(_reactContext);

var _reactConnect = require('./react/connect');

var _reactConnect2 = _interopRequireDefault(_reactConnect);

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

var Factory = function Factory(store, state) {
	if (store === undefined) store = {};

	if (store instanceof _flux2['default']) {
		if (state !== undefined) {
			store.state = state;
		}
		return store;
	}
	if (!(store instanceof Function)) {
		store = (0, _factoryStore2['default'])(store);
	}
	return new _flux2['default'](store, state !== undefined ? state : store());
};

var Bridge = function Bridge(generic) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	var bound = {};
	for (var method in generic) {
		bound[method] = generic[method].bind(bound);
	}
	bound.instance = Factory.apply(undefined, args);
	return bound;
};

exports.Bridge = Bridge;
exports.Interface = _interface2['default'];
exports.Factory = Factory;
exports.Fluxette = _flux2['default'];
exports.Store = _factoryStore2['default'];
exports.Reducer = _factoryReducer2['default'];
exports.Filter = _factoryFilter2['default'];
exports.Mapware = _factoryMapware2['default'];
exports.Context = _reactContext2['default'];
exports.connect = _reactConnect2['default'];
exports.select = _factorySelect2['default'];
exports.$normalize = _middlewareNormalize2['default'];

exports['default'] = function () {
	return Bridge((0, _interface2['default'])(), Factory.apply(undefined, arguments));
};