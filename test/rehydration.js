/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Shape, Reducer } from '..';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('rehydration', () => {
	describe('imperative', () => {
		it('should recover state from history', () => {
			let stores = {
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			};

			let { dispatch, state, history } = Flux(Shape(stores));
			dispatch({ type: TYPES.A }, { type: TYPES.B });

			let lastState = state(),
				lastHistory = history();

			let { process, state: state2 } = Flux(Shape(stores));
			process(lastHistory);

			expect(state2()).to.deep.equal(lastState);
			expect(state2()).not.to.equal(lastState);
		});
	});

	describe('declarative', () => {
		it('should recover state by initialization', () => {
			let stores = {
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			};

			let { dispatch, state } = Flux(Shape(stores));
			dispatch({ type: TYPES.A }, { type: TYPES.B });

			let lastState = state();

			let { state: state2 } = Flux(stores, lastState);

			expect(state2()).to.deep.equal(lastState);
			expect(state2()).to.equal(lastState);
		});
	});
});
