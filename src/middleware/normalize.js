import { normalize } from '../util';

export default I => {
	let { dispatch } = I;
	return { ...I, dispatch(...args) {
		dispatch.call(this, normalize(args));
	}};
};
