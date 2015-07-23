'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('./util');

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