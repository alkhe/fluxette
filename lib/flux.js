'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = require('./util');

exports['default'] = function (reducer) {
	var _state = arguments.length <= 1 || arguments[1] === undefined ? reducer() : arguments[1];

	return (function () {
		var hooks = [],
		    status = 0;

		var makeDispatch = function makeDispatch(reduce) {
			return function (actions) {
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
		};

		return ({
			reduce: function reduce(action) {
				_state = reducer(_state, action);
				return action;
			},
			using: function using() {
				var flux = _extends({}, this);

				for (var _len = arguments.length, middleware = Array(_len), _key = 0; _key < _len; _key++) {
					middleware[_key] = arguments[_key];
				}

				flux.dispatch = makeDispatch(flux.reduce = middleware.reduceRight(function (next, ware) {
					return ware.call(flux, next);
				}, flux.reduce));
				return flux;
			},
			state: function state() {
				return _state;
			},
			hook: hooks.push.bind(hooks),
			unhook: function unhook(fn) {
				(0, _util.remove)(hooks, fn);
			}
		}).using();
	})();
};

module.exports = exports['default'];