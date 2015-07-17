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

export let updateState = (stores, previous, ...data) => {
	if (stores instanceof Function) {
		stores(...data);
		stores[changedKey] = previous[0] !== stores;
		previous[0] = stores;
	}
	else {
		awareCall(stores, previous[0], ...data);
	}
}

let awareCall = (iterable, previous, ...data) => {
	for (let key in iterable) {
		let fn = iterable[key],
			prev = previous[key];
		if (fn instanceof Function) {
			fn(...data);
			fn[changedKey] = prev !== fn;
		}
		else {
			awareCall(fn, prev, ...data);
		}
	}
};

export let bootstrap = stores => [(stores instanceof Function
		? anonymous : makeSnapshot(stores))]

let makeSnapshot = stores => {
	let snap = {};
	for (let key in stores) {
		let fn = stores[key];
		snap[key] = (fn instanceof Function
			? anonymous : makeSnapshot(fn));
	}
	return snap;
}

let anonymous = {};

export let changedKey = Symbol ? Symbol() : '__fluxetteChanged';

export let listenerKey = Symbol ? Symbol() : '__fluxetteListener';

export let deleteFrom = (array, obj) => {
	let index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
}

export let shallowEqual = (a, b) => {
	if (a === b) {
		return true;
	}
	else if (a instanceof Date) {
		return a.getTime() === b.getTime();
	}
	else {
		let keys = Object.keys(a),
			length = keys.length;
		if (length !== Object.keys(b).length) {
			return false;
		}
		if (length > 1) {
			return false;
		}
		if (length == 1) {
			return a[keys[0]] === b[keys[0]];
		}
		return true;
	}
	return false;
}
