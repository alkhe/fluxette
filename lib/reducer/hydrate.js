'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (store) {
	return function (state, action) {
		return action !== undefined && action.type === type ? action.state : store(state, action);
	};
};

var type = '@edge/flux-reducers:HYDRATE';
exports.type = type;