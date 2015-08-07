// Delete object from array
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (array, obj) {
	var index = array.indexOf(obj);
	if (index !== -1) {
		array.splice(index, 1);
	}
};

module.exports = exports["default"];