import React from 'react';
import Store from './store';
import { deriveState, updateState, normalizeArray, callAll, deleteFrom, bootstrap, changedKey, listenerKey } from './util';
export { Store };

export default class {
	constructor(stores = {}) {
		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// React caching
		this.snapshot = bootstrap(stores);
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
			let { stores, hooks, snapshot } = this;
			// Synchronously process all actions
			updateState(stores, snapshot, data);
			// Call all registered listeners
			callAll(hooks, deriveState(stores));
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
		let { hooks, stores } = this;
		let state = ::this.state;
		let storefn = specifier(stores);
		storefn = storefn instanceof Function
			? storefn : () => storefn;
		return Component =>
			class extends Component {
				constructor(...args) {
					super(...args);
					// Initial state
					this.state = storefn();
					// Ensure the same reference of setState
					let listener = this[listenerKey] = () => {
						if (storefn[changedKey]) {
							console.log(storefn);
							super.setState(storefn());
						}
					};
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
