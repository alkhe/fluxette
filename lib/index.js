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

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _util = require('./util');

exports.Store = _store2['default'];

var _default = (function () {
	function _default() {
		var stores = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var middleware = arguments.length <= 1 || arguments[1] === undefined ? function (list) {
			return list;
		} : arguments[1];

		_classCallCheck(this, _default);

		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// Middleware
		this.middleware = middleware;
	}

	_createClass(_default, [{
		key: 'state',
		value: function state() {
			return (0, _util.deriveState)(this.stores);
		}
	}, {
		key: 'dispatch',
		value: function dispatch() {
			for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
				data[_key] = arguments[_key];
			}

			// Normalize array of actions
			data = (0, _util.flattenDeep)(data).filter(function (x) {
				return x instanceof Object;
			});
			if (data.length > 0) {
				var _history;

				// Call Middleware
				data = this.middleware(data);
				// Push all actions onto stack
				(_history = this.history).push.apply(_history, _toConsumableArray(data));
				var stores = this.stores;

				// Synchronously process all actions
				(0, _util.updateState)(stores, data);
				// Call all registered listeners
				(0, _util.callAll)(this.hooks, (0, _util.deriveState)(stores));
			}
		}
	}, {
		key: 'hook',
		value: function hook(fn) {
			// Add listener
			this.hooks.push(fn);
		}
	}, {
		key: 'unhook',
		value: function unhook(fn) {
			// Remove listener
			(0, _util.deleteFrom)(this.hooks, fn);
		}
	}, {
		key: 'connect',
		value: function connect() {
			var specifier = arguments.length <= 0 || arguments[0] === undefined ? function (data) {
				return data;
			} : arguments[0];
			var property = arguments.length <= 1 || arguments[1] === undefined ? 'flux' : arguments[1];

			// typecheck
			if ((0, _util.isString)(specifier)) {
				property = specifier;
				specifier = function (data) {
					return data;
				};
			}
			// decorator for React class
			var hooks = this.hooks;

			var state = this.state.bind(this);
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
						var lastState = specifier(state());
						this.state = _defineProperty({}, property, lastState);
						// Ensure the same reference of setState
						var listener = this[_util.listenerKey] = function (data) {
							var newState = specifier(data);
							if (lastState !== newState) {
								lastState = newState;
								_get(Object.getPrototypeOf(_class.prototype), 'setState', _this).call(_this, _defineProperty({}, property, newState));
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