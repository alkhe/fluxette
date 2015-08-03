import Fluxette from './flux';

import Store from './factory/store';
import Reducer from './factory/reducer';
import Mapware from './factory/mapware';
import select from './factory/select';

import normalize from './middleware/normalize';

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
	connect, link, select,
	normalize
};

export default (...args) => new Interface(Factory(...args));
