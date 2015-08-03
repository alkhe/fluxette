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

// Delete object from array
export let deleteFrom = (array, obj) => {
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
};

// export let shallowEqual = (left, right) => {
// 	if ((left === right) || Object.is(left, right)) {
// 		return true;
// 	}
//
// 	let keys = Object.keys(left);
//
// 	if (!same(keys, Object.keys(right))) {
// 		return false;
// 	}
//
// 	for (let i in keys) {
// 		let key = keys[i];
// 		if (left[key] !== right[key]) {
// 			return false;
// 		}
// 	}
//
// 	return true;
// };

export let listenerKey = (typeof Symbol !== 'undefined') ? Symbol() : '@@fluxetteListener';
