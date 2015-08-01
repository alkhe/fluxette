import { listenerKey } from './util';

export default selector => {
	return Component =>
		class extends Component {
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
