'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _util = require('./util');

exports['default'] = function (store, initial) {
	var _state = undefined,
	    _history = undefined,
	    buffer = undefined,
	    hooks = [],
	    status = 0;

	var reduce = function reduce(action) {
		_history.push(action);
		buffer.push(action);
		_state = store(_state, action);
	},
	    init = function init(s) {
		_history = [];
		buffer = [];
		_state = s !== undefined ? s : store();
	},
	    dispatch = function dispatch() {
		for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
			actions[_key] = arguments[_key];
		}

		actions = (0, _util.normalize)(actions);
		if (actions.length > 0) {
			process(actions, true);
			if (status === 0) {
				update();
			}
		}
	},
	    process = function process(actions, normalized) {
		if (!normalized) {
			actions = (0, _util.normalize)(actions);
		}
		status++;
		actions.forEach(reduce);
		status--;
	},
	    update = function update() {
		for (var i = 0; i < hooks.length; i++) {
			hooks[i](_state, buffer);
		}
		buffer = [];
	};

	init(initial);

	var flux = {
		init: init, dispatch: dispatch, process: process, update: update,
		use: function use() {
			for (var _len2 = arguments.length, middleware = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				middleware[_key2] = arguments[_key2];
			}

			reduce = (0, _util.middle)(flux, middleware, reduce);
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
	return flux;
};

module.exports = exports['default'];