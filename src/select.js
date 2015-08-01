import { same } from './util';

export default (getters, deriver) => {
	// Ensure Array
	if (!(getters instanceof Array)) {
		getters = [getters];
	}
	// Caches
	let lastGets = [],
		derived = {};
	return state => {
		// New selections
		let gets = getters.map(fn => fn(state));
		// If selections are different, invalidate
		if (!same(lastGets, gets)) {
			derived = deriver(...gets);
			lastGets = gets;
		}
		return derived;
	};
};
