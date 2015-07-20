import React from 'react';
import Store from './store';
import { deriveState, updateState, normalizeArray, callAll, deleteFrom, listenerKey } from './util';
export { Store };

export default class {
	constructor(stores = {}, middleware = list => list) {
		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// Middleware
		this.middleware = middleware;
	}
	state() {
		return deriveState(this.stores);
	}
	dispatch(...data) {
		// Normalize array of actions
		data = normalizeArray(data).filter(x => x instanceof Object);
		if (data.length > 0) {
			// Call Middleware
			data = this.middleware(data);
			// Push all actions onto stack
			this.history.push(...data);
			let { stores } = this;
			// Synchronously process all actions
			updateState(stores, data);
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
					this.state = specifier(state());
					// Ensure the same reference of setState
					let listener = this[listenerKey] = data => super.setState(specifier(data));
					// Register setState
					hooks.push(listener);
				}
				componentWillUnmount(...args) {
					super.componentWillUnmount(...args);
					// Unregister setState
					deleteFrom(hooks, this[listenerKey]);
				}
			}
	}
}
