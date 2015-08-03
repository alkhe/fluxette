'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _flux = require('./flux');

var _flux2 = _interopRequireDefault(_flux);

var _wareStore = require('./ware/store');

var _wareStore2 = _interopRequireDefault(_wareStore);

var _wareReducer = require('./ware/reducer');

var _wareReducer2 = _interopRequireDefault(_wareReducer);

var _wareMapware = require('./ware/mapware');

var _wareMapware2 = _interopRequireDefault(_wareMapware);

var _wareSelect = require('./ware/select');

var _wareSelect2 = _interopRequireDefault(_wareSelect);

var _reactConnect = require('./react/connect');

var _reactConnect2 = _interopRequireDefault(_reactConnect);

var _reactLink = require('./react/link');

var _reactLink2 = _interopRequireDefault(_reactLink);

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

var Factory = function Factory() {
	var store = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var auto = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	// Autocreate Store if shape is passed
	if (!(store instanceof Function)) {
		store = (0, _wareStore2['default'])(store);
	}
	// If auto, initialize to default
	// Otherwise wait for user to init
	return new _flux2['default'](store, auto ? store() : undefined);
};

exports.Factory = Factory;
exports.Interface = _interface2['default'];
exports.Store = _wareStore2['default'];
exports.Reducer = _wareReducer2['default'];
exports.Mapware = _wareMapware2['default'];
exports.connect = _reactConnect2['default'];
exports.link = _reactLink2['default'];
exports.select = _wareSelect2['default'];

exports['default'] = function () {
	return new _interface2['default'](Factory.apply(undefined, arguments));
};