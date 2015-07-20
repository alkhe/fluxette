import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Store } from '..';

chai.use(spies);

const TYPES = {
	X: {
		A: 'X_A',
		B: 'X_B'
	},
	Y: {
		A: 'Y_A',
		B: 'Y_B'
	},
	Z: 'Z'
};

describe('Flux', () => {

	let flux, stores, listener,
		AXA, AXB, AYA,
		BXA, BYA, BYB;

	let middleware;

	let flux2;

	beforeEach(() => {
		listener = chai.spy(() => {});

		AXA = chai.spy(state => ({ ...state, propAA: 123 }));
		AXB = chai.spy(state => ({ ...state, propAA: 234, propAB: 'thing' }));
		AYA = chai.spy(state => ({ ...state, propAB: 'test string' }));

		BXA = chai.spy(state => ({ ...state, propBA: { num: 6 } }));
		BYA = chai.spy(state => ({ ...state, propBB: [1, 2] }));
		BYB = chai.spy(state => ({ ...state, propBA: { num: 9 }, propBB: ['3', '4'] }));

		stores = {
			storeA: Store({ propAA: 0, propAB: '' }, {
				[TYPES.X.A]: AXA,
				[TYPES.X.B]: AXB,
				[TYPES.Y.A]: AYA,
			}),
			storeB: Store({ propBA: {}, propBB: [] }, {
				[TYPES.X.A]: BXA,
				[TYPES.Y.A]: BYA,
				[TYPES.Y.B]: BYB
			}),
			storeC: {
				storeCA: Store(0, {
					[TYPES.Y.A]: state => state + 1
				}),
				storeCB: {
					storeCBA: [
						Store(5, {
							[TYPES.Y.A]: state => state + 1
						}),
						Store(7, {
							[TYPES.Y.A]: state => state + 1
						})
					]
				}
			}
		};

		middleware = chai.spy(list => list.map(action => action.type == TYPES.Z
			? { ...action, extra: 'ex' } : action));

		flux = new Flux(stores, middleware);

		flux2 = new Flux(Store(0, {
			[TYPES.X.A]: state => state + 5
		}));
	})

	describe('constructor', () => {
		it('should properly construct flux class', () => {
			expect(flux).to.have.property('stores', stores);
			expect(flux).to.have.property('hooks')
				.that.is.an.instanceof(Array);
			expect(flux).to.have.property('history')
				.that.is.an.instanceof(Array)
				.and.deep.equals([]);
			expect(flux).to.have.property('state')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('dispatch')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('hook')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('unhook')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('connect')
				.that.is.an.instanceof(Function);
		})
	})

	describe('state', () => {
		it('should return state when called', () => {
			expect(flux.state()).to.deep.equal({
				storeA: {
					propAA: 0,
					propAB: ''
				},
				storeB: {
					propBA: {},
					propBB: []
				},
				storeC: {
					storeCA: 0,
					storeCB: {
						storeCBA: [5, 7]
					}
				}
			});

			expect(flux2.state()).to.equal(0);
		})
	})

	describe('dispatch', () => {
		it('should update state when called', () => {
			flux.dispatch({ type: TYPES.X.A });
			let state = flux.state();
			expect(state).to.have.deep.property('storeA.propAA', 123);
			expect(state).to.have.deep.property('storeB.propBA')
				.that.deep.equals({ num: 6 });

			flux2.dispatch({ type : TYPES.X.A });
			expect(flux2.state()).to.equal(5);
		})
		it('should dispatch arrays', () => {
			flux.dispatch([{ type: TYPES.X.A }, { type: TYPES.X.B }, { type: TYPES.Y.B }]);
			let state = flux.state();
			expect(state).to.have.property('storeA')
				.that.deep.equals({ propAA: 234, propAB: 'thing' });
			expect(state).to.have.property('storeB')
				.that.deep.equals({ propBA: { num: 9 }, propBB: ['3', '4'] });

			flux2.dispatch([{ type : TYPES.X.A }, { type : TYPES.X.A }]);
			expect(flux2.state()).to.equal(10);
		})
		it('should dispatch argument lists', () => {
			flux.dispatch({ type: TYPES.X.A }, { type: TYPES.X.B }, { type: TYPES.Y.B });
			let state = flux.state();
			expect(state).to.have.property('storeA')
				.that.deep.equals({ propAA: 234, propAB: 'thing' });
			expect(state).to.have.property('storeB')
				.that.deep.equals({ propBA: { num: 9 }, propBB: ['3', '4'] });
		})
		it('should not dispatch when nothing is passed', () => {
			flux.hook(listener);
			flux.dispatch();
			expect(listener).not.to.have.been.called;
		})
		it('should not dispatch when non-Objects are passed', () => {
			flux.hook(listener);
			flux.dispatch(undefined, [0, false, null]);
			expect(listener).not.to.have.been.called;
		})
		it('should call middleware when called', () => {
			flux.dispatch({ type: TYPES.Z }, { type: TYPES.X.A });
			expect(middleware).to.have.been.called.once;
			expect(flux.history).to.deep.equal([{ type: TYPES.Z, extra: 'ex' }, { type: TYPES.X.A }]);
		})
	})

	describe('history', () => {
		it('should be updated on dispatch', () => {
			flux.dispatch({ type: TYPES.X.A }, { type: TYPES.Y.A }, { type: TYPES.Y.B });
			expect(flux).to.have.property('history')
				.that.deep.equals([{ type: TYPES.X.A }, { type: TYPES.Y.A }, { type: TYPES.Y.B }]);
		})
	});

	describe('hook', () => {
		it('should call listeners by the number of valid dispatches', () => {
			flux.hook(listener);
			flux.dispatch({ type: TYPES.X.A }, { type: TYPES.X.B }, { type: TYPES.Y.B });
			flux.dispatch();
			flux.dispatch([{ type: TYPES.X.A }, { type: TYPES.X.B }], { type: TYPES.Y.B });
			flux.dispatch({ type: TYPES.X.A });
			expect(listener).to.have.been.called.exactly(3);
		})
		it('should call listeners with (state, actions)', () => {
			let hook = (state, actions) => {
				expect(actions).to.deep.equal([{ type: TYPES.X.A }, { type: TYPES.X.B }, { type: TYPES.Y.B }]);
			}
			flux.hook(listener);
			flux.dispatch({ type: TYPES.X.A }, { type: TYPES.X.B }, { type: TYPES.Y.B });
			expect(listener).to.have.been.called.once;
		})
	})

	describe('unhook', () => {
		it('should not call listeners after unhook', () => {
			flux.hook(listener);
			flux.dispatch({ type: TYPES.X.A }, { type: TYPES.X.B }, { type: TYPES.Y.B });
			flux.dispatch();
			flux.dispatch([{ type: TYPES.X.A }, { type: TYPES.X.B }], { type: TYPES.Y.B });
			flux.unhook(listener);
			flux.dispatch({ type: TYPES.X.A });
			expect(listener).to.have.been.called.twice;
		})
	})
})
