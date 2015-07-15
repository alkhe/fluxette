import _ from '../vendor/lodash';

export let deriveState = stores => _.mapValues(stores, store => store());

export let normalizeArray = _.flattenDeep;

export let callAll = (iterable, ...data) => {
	for (let fn of iterable) {
		fn(...data);
	}
};

export let callAllObj = (keyIterable, ...data) => {
	for (let key in keyIterable) {
		keyIterable[key](...data);
	}
};

export let listenerKey = Symbol();
