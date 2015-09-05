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

describe('dispatch', () => {
	it('should update state when called', () => {
		let { dispatch, state } = Flux(Shape({
			a: Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}),
			b: Reducer('', {
				[TYPES.A]: state => state + 'a',
				[TYPES.B]: state => state + 'b'
			})
		}));

		dispatch({ type: TYPES.A });
		expect(state()).to.deep.equal({
			a: 1,
			b: 'a'
		});
		dispatch({ type: TYPES.B });
		expect(state()).to.deep.equal({
			a: 0,
			b: 'ab'
		});
	});
	it('should dispatch arrays', () => {
		let { dispatch, state } = Flux(Shape({
			a: Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}),
			b: Reducer('', {
				[TYPES.A]: state => state + 'a',
				[TYPES.B]: state => state + 'b'
			})
		}));

		dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
		expect(state()).to.deep.equal({
			a: 0,
			b: 'ab'
		});
	});
	it('should not call hooks when nothing is passed', () => {
		let { dispatch, hook } = Flux(Shape({
			a: Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}),
			b: Reducer('', {
				[TYPES.A]: state => state + 'a',
				[TYPES.B]: state => state + 'b'
			})
		}));

		let spy = chai.spy(() => {});
		hook(spy);
		dispatch();
		expect(spy).not.to.have.been.called;
	});
	it('should not notify hooks when non-Objects are passed', () => {
		let { dispatch, hook } = Flux(Shape({
			a: Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}),
			b: Reducer('', {
				[TYPES.A]: state => state + 'a',
				[TYPES.B]: state => state + 'b'
			})
		}));

		let spy = chai.spy(() => {});
		hook(spy);
		dispatch(undefined, [0, false, null]);
		expect(spy).not.to.have.been.called;
	});
});
