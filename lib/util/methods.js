"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var names = Object.getOwnPropertyNames.bind(Object);

var writeOnto = function writeOnto(o, arr) {
	for (var i = 1; i < arr.length; i++) {
		o[arr[i]] = 0;
	}
};

exports["default"] = function (Class) {
	var last = Object.__proto__;
	var m = {};
	do {
		writeOnto(m, names(Class.prototype));
	} while ((Class = Class.__proto__) !== last);
	return m;
};

module.exports = exports["default"];