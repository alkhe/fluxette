import { normalize } from '../util';

export default Interface =>
	class extends Interface {
		dispatch(...actions) {
			super.dispatch(normalize(actions));
		}
	};
