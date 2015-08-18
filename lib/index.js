'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _flux = require('./flux');

var _flux2 = _interopRequireDefault(_flux);

var _reducerStore = require('./reducer/store');

var _reducerStore2 = _interopRequireDefault(_reducerStore);

var _reducerReducer = require('./reducer/reducer');

var _reducerReducer2 = _interopRequireDefault(_reducerReducer);

var _reducerFilter = require('./reducer/filter');

var _reducerFilter2 = _interopRequireDefault(_reducerFilter);

var _reducerFor = require('./reducer/for');

var _reducerFor2 = _interopRequireDefault(_reducerFor);

var _reactContext = require('./react/context');

var _reactContext2 = _interopRequireDefault(_reactContext);

var _reactConnect = require('./react/connect');

var _reactConnect2 = _interopRequireDefault(_reactConnect);

var _factorySelect = require('./factory/select');

var _factorySelect2 = _interopRequireDefault(_factorySelect);

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

var _util = require('./util');

var Factory = function Factory(store, state) {
	if (store instanceof _flux2['default']) {
		if (state !== undefined) {
			store.state = state;
		}
		return store;
	}
	return new _flux2['default'](store, state !== undefined ? state : store());
};

var Bridge = function Bridge(Generic) {
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	var bound = new Generic(Factory.apply(undefined, args));
	var m = (0, _util.methods)(Generic);
	for (var i in m) {
		bound[i] = bound[i].bind(bound);
	}
	return bound;
};

exports.Bridge = Bridge;
exports.Interface = _interface2['default'];
exports.Factory = Factory;
exports.Store = _reducerStore2['default'];
exports.Reducer = _reducerReducer2['default'];
exports.Filter = _reducerFilter2['default'];
exports.For = _reducerFor2['default'];
exports.Context = _reactContext2['default'];
exports.connect = _reactConnect2['default'];
exports.select = _factorySelect2['default'];
exports.Fluxette = _flux2['default'];
// debugging

exports['default'] = function () {
	return Bridge(_interface2['default'], Factory.apply(undefined, arguments));
};