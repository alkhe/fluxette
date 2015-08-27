/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Reducer } from '..';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('hook', () => {
	it('should call listeners by the number of valid dispatches', () => {
		let { dispatch, hook } = Flux(Reducer(0, {
			[TYPES.A]: state => state + 1,
			[TYPES.B]: state => state - 1
		}));

		let spy = chai.spy(() => {});
		hook(spy);
		dispatch({ type: TYPES.A }, { type: TYPES.B });
		dispatch();
		dispatch(false, null);
		dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
		dispatch({ type: TYPES.A });
		expect(spy).to.have.been.called.exactly(3);
	});
	it('should call listeners with (state, actions)', () => {
		let { dispatch, state: getState, hook } = Flux(Reducer(0, {
			[TYPES.A]: state => state + 1,
			[TYPES.B]: state => state - 1
		}));

		let spy = chai.spy((state, actions) => {
			expect(actions).to.deep.equal([{ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS }]);
			expect(state).to.equal(getState());
		});
		hook(spy);
		dispatch([{ type: TYPES.A }, { type: TYPES.B }], { type: TYPES.BOGUS });
		expect(spy).to.have.been.called.once;
	});
});

describe('unhook', () => {
	it('should not call listeners after unhook', () => {
		let { dispatch, hook, unhook } = Flux(Reducer(0, {
			[TYPES.A]: state => state + 1,
			[TYPES.B]: state => state - 1
		}));

		let spy = chai.spy(() => {});
		hook(spy);
		dispatch({ type: TYPES.A }, { type: TYPES.B });
		dispatch();
		dispatch(false, null);
		dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
		unhook(spy);
		dispatch({ type: TYPES.A });
		expect(spy).to.have.been.called.twice;
	});
});
