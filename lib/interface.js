'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _util = require('./util');

exports['default'] = {
	dispatch: function dispatch() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		this.middle((0, _util.normalize)(args));
	},
	middle: function middle() {
		this.process.apply(this, arguments);
	},
	process: function process(actions) {
		var update = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		if (actions.length > 0) {
			var instance = this.instance;

			instance.process(actions);
			if (update) {
				instance.update(actions);
			}
		}
	},
	update: function update() {
		var _instance;

		(_instance = this.instance).update.apply(_instance, arguments);
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
module.exports = exports['default'];