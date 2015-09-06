let $normalize = (arr, into) => {
	for (let i = 0; i < arr.length; i++) {
		let val = arr[i];
		if (Array.isArray(val)) {
			$normalize(val, into);
		}
		else {
			if (val instanceof Object) {
				into.push(val);
			}
		}
	}
};

export let normalize = arr => {
	if (Array.isArray(arr)) {
		let norm = [];
		$normalize(arr, norm);
		return norm;
	}
	else {
		return [arr];
	}
};

// Delete object from array
export let remove = (array, obj) => {
	let index = array.indexOf(obj);
	if (index !== -1) {
		array.splice(index, 1);
	}
};
