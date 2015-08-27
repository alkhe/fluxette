/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Reducer, thunk, promise } from '..';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('middleware', () => {
	describe('thunk', () => {
		it('should dispatch functions', done => {
			let flux = Flux(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));
			flux.use([thunk]);
			flux.dispatch({ type: TYPES.A });

			flux.hook(state => {
				expect(state).to.equal(2);
				done();
			});

			flux.dispatch(({ dispatch }) => {
				dispatch({ type: TYPES.A });
			});
		});
	});
	describe('promise', () => {
		it('should dispatch promises', done => {
			let flux = Flux(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));
			flux.use([promise, thunk]);
			flux.dispatch({ type: TYPES.A });

			let temporal = () => {
				flux.unhook(temporal);
				flux.hook(state => {
					expect(state).to.equal(2);
					done();
				});
			};
			flux.hook(temporal);

			flux.dispatch(new Promise(res => {
				setTimeout(() => res({ type: TYPES.A }), 10);
			}));
		});
	});
});