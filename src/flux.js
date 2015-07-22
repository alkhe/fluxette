import React from 'react';
import { stateCall, normalizeArray, callAll, waterfall, isString, deleteFrom, listenerKey } from './util';

export default class {
	constructor(stores = {}, middleware = []) {
		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// Middleware
		this.middleware = middleware instanceof Array ? middleware : [middleware];
		// State
		this.state = stateCall(this.stores);
	}
	dispatch(...actions) {
		// Normalize array of actions
		actions = normalizeArray(actions);
		if (actions.length > 0) {
			// Call Middleware
			actions = waterfall(actions, this.middleware);
			// Push all actions onto stack
			this.history.push(...actions);
			// Synchronously process all actions
			this.state = stateCall(this.stores, actions);
			// Call all registered listeners
			callAll(this.hooks, actions, this.state);
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
					let listener = this[listenerKey] = (actions, data) => {
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
