import React from 'react';
import Store from './store';
import { deriveState, normalizeArray, callAll, callAllDeep, deleteFrom, listenerKey } from './util';
export { Store };

export default class {
	constructor(stores = {}) {
		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
	}
	state() {
		return deriveState(this.stores);
	}
	dispatch(...data) {
		// Normalize array of actions
		data = normalizeArray(data).filter(x => x instanceof Object);
		if (data.length > 0) {
			// Push all actions onto stack
			this.history.push(...data);
			let { stores } = this;
			// Synchronously process all actions
			callAllDeep(stores, data);
			// Call all registered listeners
			callAll(this.hooks, deriveState(stores));
		}
	}
	hook(fn) {
		// Add listener
		this.hooks.push(fn);
	}
	unhook(fn) {
		// Remove listener
		deleteFrom(this.hooks, fn);
	}
	connect(specifier = data => data) {
		// decorator for React class
		let { hooks } = this;
		let state = ::this.state;
		return Component =>
			class extends Component {
				constructor(...args) {
					super(...args);
					// Initial state
					this.state = state();
					// Ensure the same reference of setState
					this[listenerKey] = data => super.setState(specifier(data));
					// Register setState
					hooks.push(this[listenerKey]);
				}
				componentWillUnmount(...args) {
					super.componentWillUnmount(...args);
					// Unregister setState
					deleteFrom(hooks, this[listenerKey]);
				}
			}
	}
}
