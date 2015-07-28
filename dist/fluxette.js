(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["fluxette"] = factory();
	else
		root["fluxette"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _flux = __webpack_require__(2);

	var _flux2 = _interopRequireDefault(_flux);

	var _store = __webpack_require__(4);

	var _store2 = _interopRequireDefault(_store);

	var _mapware = __webpack_require__(3);

	var _mapware2 = _interopRequireDefault(_mapware);

	var _util = __webpack_require__(1);

	exports.Fluxette = _flux2['default'];
	exports.Store = _store2['default'];
	exports.Mapware = _mapware2['default'];

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
			proxy: (_context = flux.middleware).push.bind(_context),
			unproxy: function unproxy(fn) {
				(0, _util.deleteFrom)(flux.middleware, fn);
			},
			hook: (_context = flux.hooks).push.bind(_context),
			unhook: function unhook(fn) {
				(0, _util.deleteFrom)(flux.hooks, fn);
			},
			connect: flux.connect.bind(flux)
		};
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	var fluxDispatch = function fluxDispatch(flux, actions) {
		var _flux$history;

		// Push all actions onto stack
		(_flux$history = flux.history).push.apply(_flux$history, _toConsumableArray(actions));
		// Synchronously process all actions
		atomicDispatch(flux.vector, actions);
		// Derive state
		flux.state = derive(flux.stores);
		// Call all registered listeners
		callAll(flux.hooks, actions, flux.state);
	};

	// Flatten a Store into an array
	exports.fluxDispatch = fluxDispatch;
	var vectorize = function vectorize(store) {
		if (store instanceof Function) {
			return [store];
		} else {
			var norm = [];
			$vectorize(store, norm);
			return norm;
		}
	};

	exports.vectorize = vectorize;
	var $vectorize = function $vectorize(obj, into) {
		for (var i in obj) {
			var store = obj[i];
			if (store instanceof Function) {
				into.push(store);
			} else {
				$vectorize(store, into);
			}
		}
	};

	// Derive state from stores
	// If it's a store, just get its state
	// Otherwise recursively derive
	var derive = function derive(store) {
		return store instanceof Function ? store() : $derive(store);
	};

	exports.derive = derive;
	var $derive = function $derive(stores) {
		var obj = stores instanceof Array ? [] : {};
		for (var key in stores) {
			var store = stores[key];
			obj[key] = store instanceof Function ? store() : $derive(store);
		}
		return obj;
	};

	// Flatten array and filter Objects
	var normalize = function normalize(arr) {
		if (arr.length > 0) {
			var norm = [];
			$normalize(arr, norm);
			return norm;
		} else {
			return arr;
		}
	};

	exports.normalize = normalize;
	var $normalize = function $normalize(arr, into) {
		for (var i = 0; i < arr.length; i++) {
			var val = arr[i];
			if (val instanceof Array) {
				$normalize(val, into);
			} else {
				if (val instanceof Object && val.type) {
					into.push(val);
				}
			}
		}
	};

	// Call each action in order with Store vector
	var atomicDispatch = function atomicDispatch(vector, actions) {
		for (var i = 0; i < actions.length; i++) {
			var action = actions[i];
			for (var j = 0; j < vector.length; j++) {
				vector[j](action);
			}
		}
	};

	// Call each in array of functions
	exports.atomicDispatch = atomicDispatch;
	var callAll = function callAll(arr) {
		for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			data[_key - 1] = arguments[_key];
		}

		for (var i = 0; i < arr.length; i++) {
			arr[i].apply(arr, data);
		}
	};

	// Delete object from array
	exports.callAll = callAll;
	var deleteFrom = function deleteFrom(array, obj) {
		var index = array.indexOf(obj);
		if (~index) {
			array.splice(index, 1);
		}
	};

	// Waterfall an array of functions
	exports.deleteFrom = deleteFrom;
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
	var willUnmountKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteWillUnmount';
	exports.willUnmountKey = willUnmountKey;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _util = __webpack_require__(1);

	var _default = (function () {
		function _default() {
			var stores = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, _default);

			// Top-level Stores
			this.stores = stores;
			// Optimized iteration vector
			this.vector = (0, _util.vectorize)(stores);
			// Dispatcher
			this.hooks = [];
			// Action Stack
			this.history = [];
			// Middleware
			this.middleware = [];
			// State
			this.state = (0, _util.derive)(this.stores);
		}

		_createClass(_default, [{
			key: 'dispatch',
			value: function dispatch() {
				for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
					actions[_key] = arguments[_key];
				}

				// Flatten and filter array of actions
				actions = (0, _util.normalize)(actions);
				if (actions.length > 0) {
					// Call Middleware
					actions = (0, _util.waterfall)(actions, this.middleware);
					// Dispatch
					(0, _util.fluxDispatch)(this, actions);
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
							this[_util.willUnmountKey] = _get(Object.getPrototypeOf(_class.prototype), 'componentWillUnmount', this) || function () {};
						}

						_createClass(_class, [{
							key: 'componentWillUnmount',
							value: function componentWillUnmount() {
								this[_util.willUnmountKey].apply(this, arguments);
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

/***/ },
/* 3 */
/***/ function(module, exports) {

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
							actions[i] = redux;
						}
					}
				}
			}
			return actions;
		};
	};

	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ }
/******/ ])
});
;