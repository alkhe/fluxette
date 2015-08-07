'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _util = require('../util');

exports['default'] = function (generic) {
	var extend = Object.create(generic);
	var dispatch = generic.dispatch;

	extend.dispatch = function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		dispatch.call(this, (0, _util.normalize)(args));
	};
	return extend;
};

module.exports = exports['default'];