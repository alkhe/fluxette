export default function(next) {
	return action =>
		action instanceof Function
			? action(this)
			: next(action);
};
