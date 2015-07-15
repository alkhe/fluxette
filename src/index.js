import React from 'react';
import Store from './store';
import { deriveState, normalizeArray, callAll, callAllObj, listenerKey } from './util';
export { Store };

export default class {
	constructor(stores = {}) {
		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = new Set();
		// Action Stack
		this.history = [];
	}
	state() {
		return deriveState(this.stores);
	}
	dispatch(...data) {
		// Normalize array of actions
		data = normalizeArray(data);
		// Push all actions onto stack
		this.history.push(...data);
		let { stores } = this;
		// Synchronously process all actions
		callAllObj(stores, data);
		// Call all registered listeners
		callAll(this.hooks, deriveState(stores));
	}
	hook(fn) {
		// Add listener
		this.hooks.add(fn);
	}
	unhook(fn) {
		// Remove listener
		this.hooks.delete(fn);
	}
	connect(specifier) {
		// decorator for React class
		let { hooks } = this;
		let state = ::this.state;
		return (Component) =>
			class extends React.Component {
				constructor(...args) {
					super(...args);
					// Initial state
					this.state = state();
					// Ensure the same reference of setState
					this[listenerKey] = ::this.setState;
					// Register setState
					hooks.add(this[listenerKey]);
				}
				componentWillUnmount(...args) {
					super.componentWillUnmount(...args);
					// Unregister setState
					hooks.delete(this[listenerKey]);
				}
				render() {
					let { props, state } = this;
					// Proxy props and state, but call the specifier on the state if provided
					return <Component { ...props } { ...(specifier ? specifier(state) : state) } />;
				}
			}
	}
}
