import { listenerKey } from './util';
import { PropTypes } from 'react';

export default (selector = x => x) => {
	return Component =>
		class extends Component {
			static contextTypes = {
				flux: PropTypes.object.isRequired
			}
			constructor(...args) {
				super(...args);
				let { flux } = this.context;
				// Initial state
				this.state = selector(flux.state());
				// Cacher function
				let listener = this[listenerKey] = (actions, state) => {
					let newState = selector(state);
					if (this.state !== newState) {
						super.setState(newState);
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
