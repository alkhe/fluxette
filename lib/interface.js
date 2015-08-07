'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _util = require('./util');

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