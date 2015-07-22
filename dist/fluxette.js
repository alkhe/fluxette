(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fluxette = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _default = (function () {
	function _default() {
		var stores = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var middleware = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

		_classCallCheck(this, _default);

		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// Middleware
		this.middleware = middleware instanceof Array ? middleware : [middleware];
		// State
		this.state = (0, _util.stateCall)(this.stores);
	}

	_createClass(_default, [{
		key: 'dispatch',
		value: function dispatch() {
			for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
				actions[_key] = arguments[_key];
			}

			// Normalize array of actions
			actions = (0, _util.normalizeArray)(actions);
			if (actions.length > 0) {
				var _history;

				// Call Middleware
				actions = (0, _util.waterfall)(actions, this.middleware);
				// Push all actions onto stack
				(_history = this.history).push.apply(_history, _toConsumableArray(actions));
				// Synchronously process all actions
				this.state = (0, _util.stateCall)(this.stores, actions);
				// Call all registered listeners
				(0, _util.callAll)(this.hooks, actions, this.state);
			}
		}
	}, {
		key: 'connect',
		value: function connect() {
			var specifier = arguments.length <= 0 || arguments[0] === undefined ? function (data) {
				return data;
			} : arguments[0];
			var identifier = arguments.length <= 1 || arguments[1] === undefined ? 'flux' : arguments[1];

			// typecheck
			if ((0, _util.isString)(specifier)) {
				identifier = specifier;
				specifier = function (data) {
					return data;
				};
			}
			// decorator for React class
			var hooks = this.hooks;
			var state = this.state;

			return function (Component) {
				return (function (_Component) {
					_inherits(_class, _Component);

					function _class() {
						var _this = this;

						_classCallCheck(this, _class);

						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, args);
						// Initial state
						var lastState = specifier(state);
						this.state = _defineProperty({}, identifier, lastState);
						// Ensure the same reference of setState
						var listener = this[_util.listenerKey] = function (actions, data) {
							var newState = specifier(data);
							if (lastState !== newState) {
								lastState = newState;
								_get(Object.getPrototypeOf(_class.prototype), 'setState', _this).call(_this, _defineProperty({}, identifier, newState));
							}
						};
						// Register setState
						hooks.push(listener);
					}

					_createClass(_class, [{
						key: 'componentWillUnmount',
						value: function componentWillUnmount() {
							for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
								args[_key3] = arguments[_key3];
							}

							_get(Object.getPrototypeOf(_class.prototype), 'componentWillUnmount', this).apply(this, args);
							// Unregister setState
							(0, _util.deleteFrom)(hooks, this[_util.listenerKey]);
						}
					}]);

					return _class;
				})(Component);
			};
		}
	}]);

	return _default;
})();

exports['default'] = _default;
module.exports = exports['default'];

},{"./util":5,"react":"react"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _flux = require('./flux');

var _flux2 = _interopRequireDefault(_flux);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _mapware = require('./mapware');

var _mapware2 = _interopRequireDefault(_mapware);

var _util = require('./util');

exports.Fluxette = _flux2['default'];
exports.Store = _store2['default'];
exports.Mapware = _mapware2['default'];

exports['default'] = function (stores) {
	var _context;

	var middleware = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	var flux = new _flux2['default'](stores, middleware);
	return {
		dispatch: flux.dispatch.bind(flux),
		state: function state() {
			return flux.state;
		},
		history: function history() {
			return flux.history;
		},
		hook: (_context = flux.hooks).push.bind(_context),
		unhook: function unhook(fn) {
			(0, _util.deleteFrom)(flux.hooks, fn);
		},
		connect: flux.connect.bind(flux)
	};
};

},{"./flux":1,"./mapware":3,"./store":4,"./util":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var reducers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	// Function that takes an action or array of actions
	return function (actions) {
		// If no actions, just return them
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the action
			for (var i = 0; i < actions.length; i++) {
				var action = actions[i];
				var reducer = reducers[action.type];
				if (reducer) {
					var redux = reducer(action);
					if (redux !== undefined) {
						action[i] = redux;
					}
				}
			}
		}
		return actions;
	};
};

module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var reducers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	// Function that takes an action or array of actions
	return function (actions) {
		// If no actions, just return state
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the state and the action
			for (var i = 0; i < actions.length; i++) {
				var action = actions[i];
				var reducer = reducers[action.type];
				if (reducer) {
					var redux = reducer(state, action);
					if (redux !== undefined) {
						state = redux;
					}
				}
			}
		}
		return state;
	};
};

module.exports = exports["default"];

},{}],5:[function(require,module,exports){
// Dispatch actions to stores
// If it's a store, just dispatch it
// Otherwise recursively dispatch
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var stateCall = function stateCall(store, data) {
	return store instanceof Function ? store(data) : derive(store, data);
};

exports.stateCall = stateCall;
var derive = function derive(stores, data) {
	var obj = stores instanceof Array ? [] : {};
	for (var key in stores) {
		var store = stores[key];
		obj[key] = store instanceof Function ? store(data) : derive(store, data);
	}
	return obj;
};

// Flatten array and filter Objects
var normalizeArray = function normalizeArray(arr) {
	return arr.length ? normalize(arr, []) : arr;
};

exports.normalizeArray = normalizeArray;
var normalize = function normalize(arr, into) {
	for (var i = 0; i < arr.length; i++) {
		var val = arr[i];
		if (val instanceof Array) {
			normalize(val, into);
		} else {
			if (val instanceof Object) {
				into.push(val);
			}
		}
	}
	return into;
};

// Call each in array of functions
var callAll = function callAll(arr) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	for (var i = 0; i < arr.length; i++) {
		arr[i].apply(arr, data);
	}
};

exports.callAll = callAll;
// Delete object from array
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};

exports.deleteFrom = deleteFrom;
//
var waterfall = function waterfall(value, functions) {
	for (var i = 0; i < functions.length; i++) {
		value = functions[i](value);
	}
	return value;
};

exports.waterfall = waterfall;
var isString = function isString(val) {
	return typeof val === 'string' || val instanceof String;
};

exports.isString = isString;
var listenerKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteListener';
exports.listenerKey = listenerKey;

},{}]},{},[2])(2)
});