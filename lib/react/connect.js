'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

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