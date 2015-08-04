import { PropTypes, Component } from 'react';

export default class Context extends Component {
	static childContextTypes = {
		flux: PropTypes.object.isRequired
	}
	getChildContext() {
		return { flux: this.props.flux };
	}
	render() {
		return this.props.children();
	}
}
