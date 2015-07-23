export let fluxDispatch = (flux, actions) => {
	// Push all actions onto stack
	flux.history.push(...actions);
	// Synchronously process all actions
	atomicDispatch(flux.vector, actions);
	// Derive state
	flux.state = derive(flux.stores);
	// Call all registered listeners
	callAll(flux.hooks, actions, flux.state);
};

// Flatten a Store into an array
export let vectorize = store => {
	if (store instanceof Function) {
		return [store];
	}
	else {
		let norm = [];
		$vectorize(store, norm);
		return norm;
	}
};

let $vectorize = (obj, into) => {
	for (let i in obj) {
		let store = obj[i];
		if (store instanceof Function) {
			into.push(store);
		}
		else {
			$vectorize(store, into);
		}
	}
};

// Derive state from stores
// If it's a store, just get its state
// Otherwise recursively derive
export let derive = store => store instanceof Function
	? store() : $derive(store);

let $derive = stores => {
	let obj = stores instanceof Array ? [] : {};
	for (let key in stores) {
		let store = stores[key];
		obj[key] = store instanceof Function
			? store()
			: $derive(store);
	}
	return obj;
};

// Flatten array and filter Objects
export let normalize = arr => {
	if (arr.length > 0) {
		let norm = [];
		$normalize(arr, norm);
		return norm;
	}
	else {
		return arr;
	}
};

let $normalize = (arr, into) => {
	for (let i = 0; i < arr.length; i++) {
		let val = arr[i];
		if (val instanceof Array) {
			$normalize(val, into);
		}
		else {
			if (val instanceof Object && val.type) {
				into.push(val);
			}
		}
	}
};

// Call each action in order with Store vector
export let atomicDispatch = (vector, actions) => {
	for (let i = 0; i < actions.length; i++) {
		let action = actions[i];
		for (let j = 0; j < vector.length; j++) {
			vector[j](action);
		}
	}
};

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
};

// Waterfall an array of functions
export let waterfall = (value, functions) => {
	for (let i = 0; i < functions.length; i++) {
		value = functions[i](value);
	}
	return value;
};

export let isString = val => typeof val === 'string' || val instanceof String;

export let listenerKey = (typeof Symbol !== 'undefined') ? Symbol() : '@@fluxetteListener';
