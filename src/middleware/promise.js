export default function(next) {
	return action =>
		action.then instanceof Function
			? action
			: next(action);
}
