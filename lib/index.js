'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _flux = require('./flux');

var _flux2 = _interopRequireDefault(_flux);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

exports.Flux = _flux2['default'];
exports.Store = _store2['default'];

exports['default'] = function (stores, middleware) {
	var flux = new _flux2['default'](stores, middleware);
	return {
		dispatch: flux.dispatch.bind(flux),
		state: function state() {
			return flux.state;
		},
		history: function history() {
			return flux.history;
		},
		hook: flux.hook.bind(flux),
		unhook: flux.unhook.bind(flux),
		connect: flux.connect.bind(flux)
	};
};