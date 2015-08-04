import Fluxette from './flux';

import Store from './factory/store';
import Reducer from './factory/reducer';
import Mapware from './factory/mapware';
import select from './factory/select';

import normalize from './middleware/normalize';

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

let Bridge = (intf, ...args) => {
	let I = {};
	for (let i in intf) {
		I[i] = intf[i].bind(I);
	}
	I.instance = Factory(...args);
	return I;
};

export {
	Bridge, Interface, Factory, Fluxette,
	Store, Reducer, Mapware,
	Context, connect, select,
	normalize
};

export default (...args) => Bridge(Interface(), Factory(...args));
