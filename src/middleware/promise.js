export default function(next) {
	return action =>
		action.then instanceof Function
			? action.then(this.dispatch)
			: next(action);
}
