import Fluxette from './flux';

import Store from './factory/store';
import Reducer from './factory/reducer';
import Filter from './factory/filter';
import Mapware from './factory/mapware';
import select from './factory/select';

import $normalize from './middleware/normalize';

import Context from './react/context';
import connect from './react/connect';

import Interface from './interface';

let Factory = (store = {}, state) => {
	if (store instanceof Fluxette) {
		if (state !== undefined) {
			store.state = state;
		}
		return store;
	}
	if (!(store instanceof Function)) {
		store = Store(store);
	}
	return new Fluxette(store, state !== undefined ? state : store());
};

let Bridge = (generic, ...args) => {
	let bound = {};
	for (let method in generic) {
		bound[method] = generic[method].bind(bound);
	}
	bound.instance = Factory(...args);
	return bound;
};

export {
	Bridge, Interface, Factory, Fluxette,
	Store, Reducer, Filter, Mapware,
	Context, connect, select,
	$normalize
};

export default (...args) => Bridge(Interface(), Factory(...args));
