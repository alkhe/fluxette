// Dispatch actions to stores
// If it's a store, just dispatch it
// Otherwise recursively dispatch
export let stateCall = (store, data) => store instanceof Function
	? store(data) : derive(store, data);

let derive = (stores, data) => {
	let obj = stores instanceof Array ? [] : {};
	for (let key in stores) {
		let store = stores[key];
		obj[key] = store instanceof Function
			? store(data)
			: derive(store, data);
	}
	return obj;
}

// Flatten array and filter Objects
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

// Call each in array of functions
export let callAll = (arr, ...data) => {
	for (let i = 0; i < arr.length; i++) {
		arr[i](...data);
	}
};

// Delete object from array
export let deleteFrom = (array, obj) => {
	let index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
}

//
export let waterfall = (value, functions) => {
	for (let i = 0; i < functions.length; i++) {
		value = functions[i](value);
	}
	return value;
}

export let isString = val => typeof val === 'string' || val instanceof String;

export let listenerKey = (typeof Symbol !== 'undefined') ? Symbol() : '@@fluxetteListener';
