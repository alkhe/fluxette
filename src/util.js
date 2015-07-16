import _ from '../vendor/lodash';

export let deriveState = stores => _.mapValues(stores, store => store());

export let normalizeArray = _.flattenDeep;

export let callAll = (iterable, ...data) => {
	for (let key in iterable) {
		iterable[key](...data);
	}
};

export let listenerKey = Symbol ? Symbol() : '__fluxetteListener' ;

export let deleteFrom = (array, obj) => {
	let index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
}
