/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Shape, Reducer, History } from '..';
import Hydrate, { type } from '../lib/reducer/hydrate';

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
				history: History(),
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
			dispatch([{ type: TYPES.A }, { type: TYPES.B }]);

			let lastState = state();

			let { dispatch: dispatch2, state: state2 } = Flux(Shape(stores));
			dispatch2(lastState.history, false);

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
			dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
			let lastState = state();

			let { dispatch: dispatch2, state: state2 } = Flux(Hydrate(Shape(stores)));
			dispatch2({ type, state: lastState });

			expect(state2()).to.deep.equal(lastState);
			expect(state2()).to.equal(lastState);
		});
	});
});
