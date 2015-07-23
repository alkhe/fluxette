import { vectorize, normalize, derive, fluxDispatch, waterfall, isString, deleteFrom, listenerKey } from './util';

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
		// Middleware
		this.middleware = [];
		// State
		this.state = derive(this.stores);
	}
	dispatch(...actions) {
		// Flatten and filter array of actions
		actions = normalize(actions);
		if (actions.length > 0) {
			// Call Middleware
			actions = waterfall(actions, this.middleware);
			// Dispatch
			fluxDispatch(this, actions);
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
					};
					// Register setState
					hooks.push(listener);
				}
				componentWillUnmount(...args) {
					super.componentWillUnmount(...args);
					// Unregister setState
					deleteFrom(hooks, this[listenerKey]);
				}
			};
	}
}
