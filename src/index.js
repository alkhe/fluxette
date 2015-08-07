import Fluxette from './flux';

import Store from './factory/store';
import Reducer from './factory/reducer';
import Filter from './factory/filter';
import select from './factory/select';

import Context from './react/context';
import connect from './react/connect';

import Interface from './interface';

import { methods } from './util';

let Factory = (store, state) => {
	if (store instanceof Fluxette) {
		if (state !== undefined) {
			store.state = state;
		}
		return store;
	}
	return new Fluxette(store, state !== undefined ? state : store());
};

let Bridge = (Generic, ...args) => {
	let bound = new Generic(Factory(...args));
	let m = methods(Generic);
	for (let i in m) {
		bound[i] = ::bound[i];
	}
	return bound;
}

export {
	Bridge, Interface, Factory,
	Store, Reducer, Filter,
	Context, connect, select
};

export { Fluxette }; // debugging

export default (...args) => Bridge(Interface, Factory(...args));
