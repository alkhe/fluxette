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
		return action;
	},
	    init = function init(s) {
		_history = [];
		buffer = [];
		_state = s !== undefined ? s : store();
	},
	    dispatch = function dispatch(actions) {
		var call = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		actions = (0, _util.normalize)(actions);
		if (actions.length > 0) {
			status++;
			actions = actions.map(reduce);
			status--;
		}
		if (call && status === 0) {
			for (var i = 0; i < hooks.length; i++) {
				hooks[i](_state, buffer);
			}
			buffer = [];
		}
		return actions;
	};

	init(initial);

	var flux = {
		init: init, dispatch: dispatch,
		use: function use() {
			for (var _len = arguments.length, middleware = Array(_len), _key = 0; _key < _len; _key++) {
				middleware[_key] = arguments[_key];
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