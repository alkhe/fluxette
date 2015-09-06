(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fluxette"] = factory();
	else
		root["fluxette"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _util = __webpack_require__(1);

	exports['default'] = function (reducer) {
		var _state = arguments.length <= 1 || arguments[1] === undefined ? reducer() : arguments[1];

		return (function () {
			var hooks = [],
			    status = 0;

			var makeDispatch = function makeDispatch(reduce) {
				return function (actions) {
					var call = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

					status++;
					actions = (0, _util.normalize)(actions).map(reduce);
					status--;
					if (call && status === 0) {
						for (var i = 0; i < hooks.length; i++) {
							hooks[i](_state);
						}
					}
					return actions;
				};
			};

			return ({
				reduce: function reduce(action) {
					_state = reducer(_state, action);
					return action;
				},
				using: function using() {
					var flux = _extends({}, this);

					for (var _len = arguments.length, middleware = Array(_len), _key = 0; _key < _len; _key++) {
						middleware[_key] = arguments[_key];
					}

					flux.dispatch = makeDispatch(flux.reduce = middleware.reduceRight(function (next, ware) {
						return ware.call(flux, next);
					}, flux.reduce));
					return flux;
				},
				state: function state() {
					return _state;
				},
				hook: hooks.push.bind(hooks),
				unhook: function unhook(fn) {
					(0, _util.remove)(hooks, fn);
				}
			}).using();
		})();
	};

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $normalize = function $normalize(arr, into) {
		for (var i = 0; i < arr.length; i++) {
			var val = arr[i];
			if (Array.isArray(val)) {
				$normalize(val, into);
			} else {
				if (val instanceof Object) {
					into.push(val);
				}
			}
		}
	};

	var normalize = function normalize(arr) {
		if (Array.isArray(arr)) {
			var norm = [];
			$normalize(arr, norm);
			return norm;
		} else {
			return [arr];
		}
	};

	exports.normalize = normalize;
	// Delete object from array
	var remove = function remove(array, obj) {
		var index = array.indexOf(obj);
		if (index !== -1) {
			array.splice(index, 1);
		}
	};
	exports.remove = remove;

/***/ }
/******/ ])
});
;