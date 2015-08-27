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

	var _reducerShape = __webpack_require__(12);

	var _reducerShape2 = _interopRequireDefault(_reducerShape);

	var _reducerReducer = __webpack_require__(11);

	var _reducerReducer2 = _interopRequireDefault(_reducerReducer);

	var _reducerFilter = __webpack_require__(9);

	var _reducerFilter2 = _interopRequireDefault(_reducerFilter);

	var _reducerFor = __webpack_require__(10);

	var _reducerFor2 = _interopRequireDefault(_reducerFor);

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
	exports.For = _reducerFor2['default'];
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
			if (right.indexOf(left[i]) === -1) {
				return false;
			}
		}
		return true;
	};

	exports.same = same;
	var constructMiddleware = function constructMiddleware(flux, mw, dispatch) {
		return mw.reduceRight(function (next, ware) {
			return ware.call(flux, next);
		}, dispatch);
	};
	exports.constructMiddleware = constructMiddleware;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _util = __webpack_require__(1);

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
			use: function use(middleware) {
				reduce = (0, _util.constructMiddleware)(flux, middleware, reduce);
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports["default"] = function (next) {
		var _this = this;

		return function (action) {
			return action.then instanceof Function ? action.then(_this.dispatch) : next(action);
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

	exports["default"] = function (reducer) {
		var partial = function partial(a) {
			return reducer(state, a);
		};
		return function (state, actions) {
			return actions.map(partial);
		};
	};

	module.exports = exports["default"];

/***/ },
/* 11 */
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
/* 12 */
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

/***/ },
/* 13 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ])
});
;