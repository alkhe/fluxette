import React, { PropTypes } from 'react';

export default flux =>
	Component =>
		class extends React.Component {
			static childContextTypes = {
				flux: PropTypes.object.isRequired
			}
			getChildContext() {
				return { flux };
			}
			render() {
				return <Component { ...this.props } />;
			}
		};
