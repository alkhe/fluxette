import Fluxette from './flux';

import Store from './ware/store';
import Reducer from './ware/reducer';
import Mapware from './ware/mapware';
import select from './ware/select';

import connect from './react/connect';
import link from './react/link';

import Interface from './interface';

let Factory = (store = {}, auto = true) => {
	// Autocreate Store if shape is passed
	if (!(store instanceof Function)) {
		store = Store(store);
	}
	// If auto, initialize to default
	// Otherwise wait for user to init
	return new Fluxette(store, auto ? store() : undefined);
};

export {
	Factory, Interface,
	Store, Reducer, Mapware,
	connect, link, select
};

export default (...args) => new Interface(Factory(...args));
