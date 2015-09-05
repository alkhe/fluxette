'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _util = require('./util');

exports['default'] = function (store, initial) {
	var _state = initial !== undefined ? initial : store(),
	    hooks = [],
	    status = 0;

	var reduce = function reduce(action) {
		_state = store(_state, action);
		return action;
	},
	    dispatch = function dispatch(actions) {
		var call = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		status++;
		actions = (0, _util.normalize)(actions).map(reduce);
		status--;
		if (call && status === 0) {
			for (var i = 0; i < hooks.length; i++) {
				hooks[i](_state);
			}
		}
		return actions;
	};

	var flux = {
		dispatch: dispatch,
		use: function use() {
			for (var _len = arguments.length, middleware = Array(_len), _key = 0; _key < _len; _key++) {
				middleware[_key] = arguments[_key];
			}

			reduce = (0, _util.middle)(flux, middleware, reduce);
		},
		state: function state() {
			return _state;
		},
		hook: hooks.push.bind(hooks),
		unhook: function unhook(fn) {
			(0, _util.remove)(hooks, fn);
		}
	};
	return flux;
};

module.exports = exports['default'];