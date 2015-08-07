"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

exports["default"] = {
	process: function process(actions) {
		var _history;

		// Log all actions in history
		(_history = this.history).push.apply(_history, _toConsumableArray(actions));
		// Synchronously process all actions
		this.state = actions.reduce(this.store, this.state);
	},
	update: function update(actions) {
		var hooks = this.hooks;

		// Call all registered hooks
		var state = this.state;
		for (var i = 0; i < hooks.length; i++) {
			hooks[i](state, actions);
		}
	}
};
module.exports = exports["default"];