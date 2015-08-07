import Fluxette from './flux';

import Store from './factory/store';
import Reducer from './factory/reducer';
import Filter from './factory/filter';
import Mapware from './factory/mapware';
import select from './factory/select';

import Context from './react/context';
import connect from './react/connect';

import Interface from './interface';

let Factory = (store, state) => {
	if (Fluxette.isPrototypeOf(store)) {
		if (state !== undefined) {
			store.state = state;
		}
		return store;
	}
	let instance = Object.create(Fluxette);
	instance.store = store;
	instance.state = state !== undefined ? state : store();
	instance.hooks = [];
	instance.history = [];
	return instance;
};

let Bridge = (generic, ...args) => {
	let bound = Object.create(generic);
	for (let method in bound) {
		let fn = bound[method];
		if (fn instanceof Function) {
			bound[method] = bound::fn;
		}
	}
	bound.instance = Factory(...args);
	return bound;
};

export {
	Bridge, Interface, Factory,
	Store, Reducer, Filter, Mapware,
	Context, connect, select
};

export { Fluxette }; // debugging

export default (...args) => Bridge(Interface, Factory(...args));
