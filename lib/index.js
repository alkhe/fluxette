'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _flux = require('./flux');

var _flux2 = _interopRequireDefault(_flux);

var _wareStore = require('./ware/store');

var _wareStore2 = _interopRequireDefault(_wareStore);

var _wareMapware = require('./ware/mapware');

var _wareMapware2 = _interopRequireDefault(_wareMapware);

var _wareSelect = require('./ware/select');

var _wareSelect2 = _interopRequireDefault(_wareSelect);

var _reactConnect = require('./react/connect');

var _reactConnect2 = _interopRequireDefault(_reactConnect);

var _reactLink = require('./react/link');

var _reactLink2 = _interopRequireDefault(_reactLink);

var _util = require('./util');

exports.Fluxette = _flux2['default'];
exports.Store = _wareStore2['default'];
exports.Mapware = _wareMapware2['default'];
exports.connect = _reactConnect2['default'];
exports.link = _reactLink2['default'];
exports.select = _wareSelect2['default'];

exports['default'] = function (stores) {
	var _context;

	var flux = new _flux2['default'](stores);
	return {
		dispatch: flux.dispatch.bind(flux),
		hydrate: function hydrate(actions) {
			return (0, _util.fluxDispatch)(flux, actions);
		},
		state: function state() {
			return flux.state;
		},
		history: function history() {
			return flux.history;
		},
		hook: (_context = flux.hooks).push.bind(_context),
		unhook: function unhook(fn) {
			(0, _util.deleteFrom)(flux.hooks, fn);
		}
	};
};