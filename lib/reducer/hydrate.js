'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var Hydrate = function Hydrate(store) {
	return function (state, action) {
		return action !== undefined && action.type === Hydrate.type ? action.state : store(state, action);
	};
};

Hydrate.type = '@edge/flux-reducers:HYDRATE';

exports['default'] = Hydrate;
module.exports = exports['default'];