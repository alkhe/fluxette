'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _util = require('./util');

exports['default'] = function (store, initial) {
	var _state = undefined,
	    _history = undefined,
	    buffer = undefined,
	    hooks = [];

	var flux = {
		init: function init(s) {
			_history = [];
			buffer = [];
			_state = s !== undefined ? s : store();
		},
		dispatch: function dispatch() {
			for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
				actions[_key] = arguments[_key];
			}

			actions = (0, _util.normalize)(actions);
			if (actions.length > 0) {
				flux.process(actions);
				flux.update();
			}
		},
		process: function process(actions) {
			var _history2, _buffer;

			// Log all actions in history
			(_history2 = _history).push.apply(_history2, _toConsumableArray(actions));
			(_buffer = buffer).push.apply(_buffer, _toConsumableArray(actions));
			// Synchronously process all actions
			_state = actions.reduce(store, _state);
		},
		update: function update() {
			for (var i = 0; i < hooks.length; i++) {
				hooks[i](_state, buffer);
			}
			buffer = [];
		},
		state: function state() {
			return _state;
		},
		history: function history() {
			return _history;
		},
		hook: hooks.push.bind(hooks),
		unhook: function unhook(fn) {
			(0, _util.remove)(hooks, fn);
		}
	};

	flux.init(initial);

	return flux;
};

module.exports = exports['default'];