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

	var _flux = __webpack_require__(3);

	var _flux2 = _interopRequireDefault(_flux);

	var _reducerShape = __webpack_require__(13);

	var _reducerShape2 = _interopRequireDefault(_reducerShape);

	var _reducerReducer = __webpack_require__(12);

	var _reducerReducer2 = _interopRequireDefault(_reducerReducer);

	var _reducerFilter = __webpack_require__(9);

	var _reducerFilter2 = _interopRequireDefault(_reducerFilter);

	var _reducerHistory = __webpack_require__(10);

	var _reducerHistory2 = _interopRequireDefault(_reducerHistory);

	var _reducerHydrate = __webpack_require__(11);

	var _reducerHydrate2 = _interopRequireDefault(_reducerHydrate);

	var _reactContext = __webpack_require__(7);

	var _reactContext2 = _interopRequireDefault(_reactContext);

	var _reactConnect = __webpack_require__(6);

	var _reactConnect2 = _interopRequireDefault(_reactConnect);

	var _reactSelect = __webpack_require__(8);

	var _reactSelect2 = _interopRequireDefault(_reactSelect);

	var _middlewareThunk = __webpack_require__(5);

	var _middlewareThunk2 = _interopRequireDefault(_middlewareThunk);

	var _middlewarePromise = __webpack_require__(4);

	var _middlewarePromise2 = _interopRequireDefault(_middlewarePromise);

	exports.Shape = _reducerShape2['default'];
	exports.Reducer = _reducerReducer2['default'];
	exports.Filter = _reducerFilter2['default'];
	exports.History = _reducerHistory2['default'];
	exports.Hydrate = _reducerHydrate2['default'];
	exports.Context = _reactContext2['default'];
	exports.connect = _reactConnect2['default'];
	exports.select = _reactSelect2['default'];
	exports.thunk = _middlewareThunk2['default'];
	exports.promise = _middlewarePromise2['default'];
	exports['default'] = _flux2['default'];

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
			if (Array.isArray(val)) {
				$normalize(val, into);
			} else {
				if (val instanceof Object) {
					into.push(val);
				}
			}
		}
	};

	var normalize = function normalize(arr) {
		if (Array.isArray(arr)) {
			var norm = [];
			$normalize(arr, norm);
			return norm;
		} else {
			return [arr];
		}
	};

	exports.normalize = normalize;
	// Delete object from array
	var remove = function remove(array, obj) {
		var index = array.indexOf(obj);
		if (index !== -1) {
			array.splice(index, 1);
		}
	};

	exports.remove = remove;
	// Determine whether two arrays are functionally equivalent
	var same = function same(left, right) {
		if (left.length !== right.length) {
			return false;
		}
		for (var i in left) {
			if (right[i] !== left[i]) {
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _util = __webpack_require__(1);

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

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports["default"] = function (next) {
		return function (action) {
			return action.then instanceof Function ? action : next(action);
		};
	};

	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports["default"] = function (next) {
		var _this = this;

		return function (action) {
			return action instanceof Function ? action(_this) : next(action);
		};
	};

	;
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
					value: _extends({}, Component.contextTypes, {
						flux: _react.PropTypes.object.isRequired
					}),
					enumerable: true
				}]);

				function Connect(props, context) {
					var _this = this;

					_classCallCheck(this, Connect);

					_get(Object.getPrototypeOf(Connect.prototype), 'constructor', this).call(this, props, context);
					var flux = context.flux;

					// Initial state
					var lastState = this.state = selector(flux.state());
					// Register caching hook
					flux.hook(this[listenerKey] = function (state) {
						var newState = selector(state);
						if (lastState !== newState) {
							_get(Object.getPrototypeOf(Connect.prototype), 'setState', _this).call(_this, lastState = newState);
						}
					});
					// Attach dispatch to component
					this.dispatch = flux.dispatch;
				}

				_createClass(Connect, [{
					key: 'componentWillUnmount',
					value: function componentWillUnmount() {
						if (_get(Object.getPrototypeOf(Connect.prototype), 'componentWillUnmount', this)) {
							_get(Object.getPrototypeOf(Connect.prototype), 'componentWillUnmount', this).call(this);
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
/* 7 */
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

/***/ },
/* 8 */
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

		if (!Array.isArray(getters)) {
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
/* 9 */
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
/* 10 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports["default"] = function () {
		return function (state, action) {
			if (state === undefined) state = [];
			return state.concat(action);
		};
	};

	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	var Hydrate = function Hydrate(store) {
		return function (state, action) {
			return action !== undefined && action.type === Hydrate.type ? action.state : store(state, action);
		};
	};

	Hydrate.type = '@edge/flux-reducers:HYDRATE';

	exports['default'] = Hydrate;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports["default"] = function () {
		var initial = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var reducers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		return function (state, action) {
			if (state === undefined) state = initial;

			// Call the appropriate reducer by type
			if (action !== undefined && action.type in reducers) {
				state = reducers[action.type](state, action);
			}
			return state;
		};
	};

	module.exports = exports["default"];

/***/ },
/* 13 */
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
				var last = state[i],
				    next = shape[i](last, action);
				if (last !== next) {
					// queue change if different
					changed = true;
					changes[i] = next;
				}
			}
			return changed ? _extends({}, state, changes) : state;
		};
	};

	module.exports = exports["default"];

/***/ }
/******/ ])
});
;