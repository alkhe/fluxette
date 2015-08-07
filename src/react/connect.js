import { PropTypes } from 'react';

let listenerKey = (typeof Symbol !== 'undefined') ? Symbol() : '@@fluxetteListener';

export default (selector = x => x) => {
	return Component =>
		class Connect extends Component {
			static contextTypes = {
				flux: PropTypes.object.isRequired
			}
			constructor(...args) {
				super(...args);
				let { flux } = this.context;
				// Initial state
				let lastState = this.state = selector(flux.state());
				// Caching Hook
				let listener = this[listenerKey] = state => {
					let newState = selector(state);
					if (lastState !== newState) {
						super.setState(lastState = newState);
					}
				};
				// Register setState
				flux.hook(listener);
			}
			componentWillUnmount(...args) {
				if (super.componentWillUnmount) {
					super.componentWillUnmount(...args);
				}
				// Unregister setState
				this.context.flux.unhook(this[listenerKey]);
			}
		};
};
