'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _util = require('../util');

var _react = require('react');

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
				var listener = this[_util.listenerKey] = function (state) {
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
					this.context.flux.unhook(this[_util.listenerKey]);
				}
			}]);

			return Connect;
		})(Component);
	};
};

module.exports = exports['default'];