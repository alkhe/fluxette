import { vectorize, normalize, derive, fluxDispatch } from './util';

export default class {
	constructor(stores = {}) {
		// Top-level Stores
		this.stores = stores;
		// Optimized iteration vector
		this.vector = vectorize(stores);
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// State
		this.state = derive(this.stores);
	}
	dispatch(...actions) {
		// Flatten and filter array of actions
		actions = normalize(actions);
		if (actions.length > 0) {
			// Dispatch
			fluxDispatch(this, actions);
		}
	}
}
