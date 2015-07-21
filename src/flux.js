import React from 'react';
import { stateCall, normalizeArray, callAll, isString, deleteFrom, listenerKey } from './util';

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
		// State
		this.state = stateCall(this.stores);
	}
	dispatch(...data) {
		// Normalize array of actions
		data = normalizeArray(data);
		if (data.length > 0) {
			// Call Middleware
			data = this.middleware(data);
			// Push all actions onto stack
			this.history.push(...data);
			// Synchronously process all actions
			this.state = stateCall(this.stores, data);
			// Call all registered listeners
			callAll(this.hooks, this.state, data);
		}
	}
	connect(specifier = data => data, identifier = 'flux') {
		// typecheck
		if (isString(specifier)) {
			identifier = specifier;
			specifier = data => data;
		}
		// decorator for React class
		let { hooks, state } = this;
		return Component =>
			class extends Component {
				constructor(...args) {
					super(...args);
					// Initial state
					let lastState = specifier(state);
					this.state = { [identifier]: lastState };
					// Ensure the same reference of setState
					let listener = this[listenerKey] = data => {
						let newState = specifier(data);
						if (lastState !== newState) {
							lastState = newState;
							super.setState({ [identifier]: newState });
						}
					}
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
