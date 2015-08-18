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

let writeMethods = (o, arr) => {
	// skip constructor
	for (let i = 1; i < arr.length; i++) {
		o[arr[i]] = 0;
	}
};

// Get object mirroring all instance methods of Class
export let methods = Class => {
	let last = Object.__proto__;
	let m = {};
	do {
		writeMethods(m, Object.getOwnPropertyNames(Class.prototype));
	} while ((Class = Class.__proto__) !== last);
	return m;
};

// Delete object from array
export let remove = (array, obj) => {
	let index = array.indexOf(obj);
	if (index !== -1) {
		array.splice(index, 1);
	}
};

// Determine whether two arrays are functionally equivalent
export let same = (left, right) => {
	if (left.length !== right.length) {
		return false;
	}
	for (let i in left) {
		if (right.indexOf(left[i]) === -1) {
			return false;
		}
	}
	return true;
}
