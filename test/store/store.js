import { Store } from '../..';
import equal from '../equal';

let ACTIONS = {
	INCREASE: Symbol(),
	DECREASE: Symbol(),
	BARIFY: Symbol()
}

let s = Store({
	num: 0,
	foo: {
		bar: 1
	}
}, {
	[ACTIONS.INCREASE]: state => ({ ...state, num: state.num + 1 }),
	[ACTIONS.DECREASE]: state => ({ ...state, num: state.num - 1 }),
	[ACTIONS.BARIFY]: state => ({ ...state, foo: { ...state.foo, bar: state.foo.bar + 1 } })
});

let state = s();
equal(state.num, 0);
state = s({ type: ACTIONS.INCREASE });
equal(state.num, 1);
state = s({ type: ACTIONS.DECREASE });
equal(state.num, 0);
state = s({ type: ACTIONS.BARIFY });
equal(state.foo.bar, 2);
state = s([
	{ type: ACTIONS.INCREASE },
	{ type: ACTIONS.INCREASE },
	{ type: ACTIONS.INCREASE },
	{ type: ACTIONS.INCREASE },
	{ type: ACTIONS.BARIFY }
]);
equal(state.num, 4);
equal(state.foo.bar, 3);
