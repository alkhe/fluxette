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