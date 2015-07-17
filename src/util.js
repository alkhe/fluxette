import _ from '../vendor/lodash';

export let deriveState = state => state instanceof Function
	? state()
	: getState(state);

let getState = stores => {
	let obj = stores instanceof Array ? [] : {};
	for (let key in stores) {
		let store = stores[key];
		obj[key] = store instanceof Function
			? store()
			: getState(store);
	}
	return obj;
};

export let normalizeArray = _.flattenDeep;

export let callAll = (iterable, ...data) => {
	for (let key in iterable) {
		iterable[key](...data);
	}
};

export let updateState = (store, ...data) => {
	if (store instanceof Function) {
		store(...data);
	}
	else {
		callAllDeep(store, ...data);
	}
}

let callAllDeep = (iterable, ...data) => {
	for (let key in iterable) {
		let fn = iterable[key];
		if (fn instanceof Function) {
			fn(...data);
		}
		else {
			callAllDeep(fn);
		}
	}
};

export let listenerKey = Symbol ? Symbol() : '__fluxetteListener' ;

export let deleteFrom = (array, obj) => {
	let index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
}
