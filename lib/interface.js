'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _util = require('./util');

exports['default'] = function () {
	return {
		dispatch: function dispatch() {
			this.process.apply(this, arguments);
		},
		process: function process() {
			var _instance;

			(_instance = this.instance).process.apply(_instance, arguments);
		},
		update: function update() {
			var _instance2;

			(_instance2 = this.instance).update.apply(_instance2, arguments);
		},
		init: function init(state) {
			var instance = this.instance;

			instance.history = [];
			instance.state = state !== undefined ? state : instance.store();
		},
		state: function state() {
			return this.instance.state;
		},
		history: function history() {
			return this.instance.history;
		},
		hook: function hook() {
			var _instance$hooks;

			(_instance$hooks = this.instance.hooks).push.apply(_instance$hooks, arguments);
		},
		unhook: function unhook(fn) {
			(0, _util.deleteFrom)(this.instance.hooks, fn);
		}
	};
};

module.exports = exports['default'];