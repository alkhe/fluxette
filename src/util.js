// Derive state from stores
// If it's a store, return the result
// Otherwise recursively build a state
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

// Dispatch actions to stores
// If it's a store, just dispatch it
// Otherwise recursively dispatch
export let updateState = (store, data) => {
	if (store instanceof Function) {
		store(data);
	}
	else {
		callAllDeep(store, data);
	}
}

let callAllDeep = (iterable, data) => {
	for (let key in iterable) {
		let fn = iterable[key];
		if (fn instanceof Function) {
			fn(data);
		}
		else {
			callAllDeep(fn);
		}
	}
};

export let normalizeArray = arr => arr.length ? normalize(arr, []) : arr;

let normalize = (arr, into) => {
	for (let i = 0; i < arr.length; i++) {
		let val = arr[i];
		if (val instanceof Array) {
			normalize(val, into);
		}
		else {
			if (val instanceof Object) {
				into.push(val);
			}
		}
	}
	return into;
}

// Call each function in an array of functions with data
export let callAll = (arr, data) => {
	for (let i = 0; i < arr.length; i++) {
		arr[i](data);
	}
};

export let deleteFrom = (array, obj) => {
	let index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
}

export let isString = val => typeof val === 'string' || val instanceof String;

export let listenerKey = (typeof Symbol !== 'undefined') ? Symbol() : '@@fluxetteListener';
