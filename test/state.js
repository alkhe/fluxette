/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux from '..';
import Shape from 'reducer/shape';
import Leaf from 'reducer/leaf';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('state', () => {
	it('should return state when called', () => {
		let { state } = Flux(Shape({
			a: Shape({
				a: Leaf(0),
				b: Leaf('')
			}),
			b: Shape({
				a: Leaf({}),
				b: Leaf([])
			})
		}));

		expect(state()).to.deep.equal({
			a: { a: 0, b: '' },
			b: { a: {}, b: [] }
		});
	});
	it('should return non-Object state when called', () => {
		let { state } = Flux(Leaf(0));
		expect(state()).to.equal(0);
	});
	it('should not change when no dispatches are made', () => {
		let { state } = Flux(Shape({
			a: Shape({
				a: Leaf(0),
				b: Leaf('')
			}),
			b: Shape({
				a: Leaf({}),
				b: Leaf([])
			})
		}));
		expect(state()).to.equal(state());
	});
	it('should not change when data is not modified', () => {
		let { dispatch, state } = Flux(Shape({
			a: Shape({
				a: Leaf(0),
				b: Leaf('')
			}),
			b: Shape({
				a: Leaf({}),
				b: Leaf([])
			})
		}));
		let old = state();
		dispatch({ type: TYPES.BOGUS });
		expect(state()).to.equal(old);
	});
});
