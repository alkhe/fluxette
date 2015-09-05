import { PropTypes } from 'react';

let listenerKey = (typeof Symbol !== 'undefined') ? Symbol() : '@@fluxetteListener';

export default (selector = x => x) => {
	return Component =>
		class Connect extends Component {
			static contextTypes = {
				...Component.contextTypes,
				flux: PropTypes.object.isRequired
			}
			constructor(props, context) {
				super(props, context);
				let { flux } = context;
				// Initial state
				let lastState = this.state = selector(flux.state());
				// Register caching hook
				flux.hook(this[listenerKey] = state => {
					let newState = selector(state);
					if (lastState !== newState) {
						super.setState(lastState = newState);
					}
				});
				// Attach dispatch to component
				this.dispatch = flux.dispatch;
			}
			componentWillUnmount() {
				if (super.componentWillUnmount) {
					super.componentWillUnmount();
				}
				// Unregister setState
				this.context.flux.unhook(this[listenerKey]);
			}
		};
};
