(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["fluxette"] = factory(require("react"));
	else
		root["fluxette"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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

	var _flux = __webpack_require__(7);

	var _flux2 = _interopRequireDefault(_flux);

	var _factoryStore = __webpack_require__(6);

	var _factoryStore2 = _interopRequireDefault(_factoryStore);

	var _factoryReducer = __webpack_require__(4);

	var _factoryReducer2 = _interopRequireDefault(_factoryReducer);

	var _factoryFilter = __webpack_require__(3);

	var _factoryFilter2 = _interopRequireDefault(_factoryFilter);

	var _factorySelect = __webpack_require__(5);

	var _factorySelect2 = _interopRequireDefault(_factorySelect);

	var _reactContext = __webpack_require__(10);

	var _reactContext2 = _interopRequireDefault(_reactContext);

	var _reactConnect = __webpack_require__(9);

	var _reactConnect2 = _interopRequireDefault(_reactConnect);

	var _interface = __webpack_require__(8);

	var _interface2 = _interopRequireDefault(_interface);

	var _util = __webpack_require__(1);

	var Factory = function Factory(store, state) {
		if (store instanceof _flux2['default']) {
			if (state !== undefined) {
				store.state = state;
			}
			return store;
		}
		return new _flux2['default'](store, state !== undefined ? state : store());
	};

	var Bridge = function Bridge(Generic) {
		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		var bound = new Generic(Factory.apply(undefined, args));
		var m = (0, _util.methods)(Generic);
		for (var i in m) {
			bound[i] = bound[i].bind(bound);
		}
		return bound;
	};

	exports.Bridge = Bridge;
	exports.Interface = _interface2['default'];
	exports.Factory = Factory;
	exports.Store = _factoryStore2['default'];
	exports.Reducer = _factoryReducer2['default'];
	exports.Filter = _factoryFilter2['default'];
	exports.Context = _reactContext2['default'];
	exports.connect = _reactConnect2['default'];
	exports.select = _factorySelect2['default'];
	exports.Fluxette = _flux2['default'];
	// debugging

	exports['default'] = function () {
		return Bridge(_interface2['default'], Factory.apply(undefined, arguments));
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
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
	var writeMethods = function writeMethods(o, arr) {
		for (var i = 1; i < arr.length; i++) {
			o[arr[i]] = 0;
		}
	};

	var methods = function methods(Class) {
		var last = Object.__proto__;
		var m = {};
		do {
			writeMethods(m, Object.getOwnPropertyNames(Class.prototype));
		} while ((Class = Class.__proto__) !== last);
		return m;
	};

	// Delete object from array
	exports.methods = methods;
	var remove = function remove(array, obj) {
		var index = array.indexOf(obj);
		if (index !== -1) {
			array.splice(index, 1);
		}
	};

	// Determine whether two arrays are functionally equivalent
	exports.remove = remove;
	var same = function same(left, right) {
		if (left.length !== right.length) {
			return false;
		}
		for (var i in left) {
			if (right.indexOf(left[i]) === -1) {
				return false;
			}
		}
		return true;
	};
	exports.same = same;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports["default"] = function (types, reducer) {
		return function (state, action) {
			return types.indexOf(action.type) !== -1 ? reducer(state, action) : reducer(state);
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

	exports["default"] = function (initial, reducers) {
		if (initial === undefined) initial = {};
		return function (state, action) {
			if (state === undefined) state = initial;

			// If no actions, just return state
			if (action !== undefined) {
				// Call the appropriate reducer by type
				var reducer = reducers[action.type];
				if (reducer) {
					var redux = reducer(state, action);
					if (redux !== undefined) {
						state = redux;
					}
				}
			}
			return state;
		};
	};

	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	var _util = __webpack_require__(1);

	exports['default'] = function (getters) {
		var deriver = arguments.length <= 1 || arguments[1] === undefined ? function (x) {
			return x;
		} : arguments[1];

		if (!(getters instanceof Array)) {
			getters = [getters];
		}
		// Caches
		var lastGets = [],
		    derived = {};
		return function (state) {
			// New selections
			var gets = getters.map(function (fn) {
				return fn(state);
			});
			// If selections are different, invalidate
			if (!(0, _util.same)(lastGets, gets)) {
				derived = deriver.apply(undefined, _toConsumableArray(gets));
				lastGets = gets;
			}
			return derived;
		};
	};

	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports["default"] = function (shape) {
		return function (state, action) {
			if (state === undefined) state = {};

			var changed = false,
			    changes = {};
			for (var i in shape) {
				var last = state[i];
				var next = shape[i](last, action);
				if (last !== next) {
					changed = true;
					changes[i] = next;
				}
			}
			return changed ? _extends({}, state, changes) : state;
		};
	};

	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _default = (function () {
		function _default(store, state) {
			_classCallCheck(this, _default);

			this.store = store;
			this.state = state;
			this.history = [];
			this.hooks = [];
		}

		_createClass(_default, [{
			key: "process",
			value: function process(actions) {
				var _history;

				// Log all actions in history
				(_history = this.history).push.apply(_history, _toConsumableArray(actions));
				// Synchronously process all actions
				this.state = actions.reduce(this.store, this.state);
			}
		}, {
			key: "update",
			value: function update(actions) {
				var hooks = this.hooks;

				// Call all registered hooks
				var state = this.state;
				for (var i = 0; i < hooks.length; i++) {
					hooks[i](state, actions);
				}
			}
		}]);

		return _default;
	})();

	exports["default"] = _default;
	;
	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _util = __webpack_require__(1);

	var _default = (function () {
		function _default(instance) {
			_classCallCheck(this, _default);

			this.instance = instance;
		}

		_createClass(_default, [{
			key: 'dispatch',
			value: function dispatch() {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				this.interop((0, _util.normalize)(args));
			}
		}, {
			key: 'interop',
			value: function interop() {
				this.process.apply(this, arguments);
			}
		}, {
			key: 'process',
			value: function process(actions) {
				var update = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

				if (actions.length > 0) {
					var instance = this.instance;

					instance.process(actions);
					if (update) {
						instance.update(actions);
					}
				}
			}
		}, {
			key: 'update',
			value: function update() {
				var _instance;

				(_instance = this.instance).update.apply(_instance, arguments);
			}
		}, {
			key: 'init',
			value: function init(state) {
				var instance = this.instance;

				instance.history = [];
				instance.state = state !== undefined ? state : instance.store();
			}
		}, {
			key: 'state',
			value: function state() {
				return this.instance.state;
			}
		}, {
			key: 'history',
			value: function history() {
				return this.instance.history;
			}
		}, {
			key: 'hook',
			value: function hook() {
				var _instance$hooks;

				(_instance$hooks = this.instance.hooks).push.apply(_instance$hooks, arguments);
			}
		}, {
			key: 'unhook',
			value: function unhook(fn) {
				(0, _util.remove)(this.instance.hooks, fn);
			}
		}]);

		return _default;
	})();

	exports['default'] = _default;
	;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var listenerKey = typeof Symbol !== 'undefined' ? Symbol() : '@@fluxetteListener';

	exports['default'] = function () {
		var selector = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
			return x;
		} : arguments[0];

		return function (Component) {
			return (function (_Component) {
				_inherits(Connect, _Component);

				_createClass(Connect, null, [{
					key: 'contextTypes',
					value: {
						flux: _react.PropTypes.object.isRequired
					},
					enumerable: true
				}]);

				function Connect() {
					var _this = this;

					_classCallCheck(this, Connect);

					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					_get(Object.getPrototypeOf(Connect.prototype), 'constructor', this).apply(this, args);
					var flux = this.context.flux;

					// Initial state
					var lastState = this.state = selector(flux.state());
					// Caching Hook
					var listener = this[listenerKey] = function (state) {
						var newState = selector(state);
						if (lastState !== newState) {
							_get(Object.getPrototypeOf(Connect.prototype), 'setState', _this).call(_this, lastState = newState);
						}
					};
					// Register setState
					flux.hook(listener);
				}

				_createClass(Connect, [{
					key: 'componentWillUnmount',
					value: function componentWillUnmount() {
						if (_get(Object.getPrototypeOf(Connect.prototype), 'componentWillUnmount', this)) {
							for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
								args[_key2] = arguments[_key2];
							}

							_get(Object.getPrototypeOf(Connect.prototype), 'componentWillUnmount', this).apply(this, args);
						}
						// Unregister setState
						this.context.flux.unhook(this[listenerKey]);
					}
				}]);

				return Connect;
			})(Component);
		};
	};

	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var Context = (function (_Component) {
		_inherits(Context, _Component);

		function Context() {
			_classCallCheck(this, Context);

			_get(Object.getPrototypeOf(Context.prototype), 'constructor', this).apply(this, arguments);
		}

		_createClass(Context, [{
			key: 'getChildContext',
			value: function getChildContext() {
				return { flux: this.props.flux };
			}
		}, {
			key: 'render',
			value: function render() {
				return this.props.children();
			}
		}], [{
			key: 'childContextTypes',
			value: {
				flux: _react.PropTypes.object.isRequired
			},
			enumerable: true
		}]);

		return Context;
	})(_react.Component);

	exports['default'] = Context;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;