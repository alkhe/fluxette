/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux from '..';
import Leaf from 'reducer/leaf';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('hook', () => {
	it('should call listeners by the number of dispatches', () => {
		let { dispatch, hook } = Flux(Leaf(0, {
			[TYPES.A]: state => state + 1,
			[TYPES.B]: state => state - 1
		}));

		let spy = chai.spy(() => {});
		hook(spy);
		dispatch({ type: TYPES.A });
		dispatch();
		dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
		dispatch({ type: TYPES.A });
		expect(spy).to.have.been.called.exactly(4);
	});
	it('should call listeners with (state)', done => {
		let { dispatch, state: getState, hook } = Flux(Leaf(0, {
			[TYPES.A]: state => state + 1,
			[TYPES.B]: state => state - 1
		}));

		let spy = chai.spy(state => {
			expect(state).to.equal(getState());
			done();
		});
		hook(spy);
		dispatch([{ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS }]);
		expect(spy).to.have.been.called.once;
	});
});

describe('unhook', () => {
	it('should not call listeners after unhook', () => {
		let { dispatch, hook, unhook } = Flux(Leaf(0, {
			[TYPES.A]: state => state + 1,
			[TYPES.B]: state => state - 1
		}));

		let spy = chai.spy(() => {});
		hook(spy);
		dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
		dispatch();
		unhook(spy);
		dispatch({ type: TYPES.A });
		expect(spy).to.have.been.called.twice;
	});
});
