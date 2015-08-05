import { normalize } from '../util';

export default generic => {
	let { dispatch } = generic;
	return { ...generic, dispatch(...args) {
		dispatch.call(this, normalize(args));
	}};
};
