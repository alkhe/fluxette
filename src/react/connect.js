import { PropTypes } from 'react';

export default flux =>
	Component =>
		class extends Component {
			static childContextTypes = {
				flux: PropTypes.object.isRequired
			}
			getChildContext() {
				return { flux };
			}
		};
