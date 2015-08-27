/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Store, Reducer } from '..';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('Flux', () => {

	describe('default', () => {
		it('should properly construct flux class', () => {
			let flux = Flux(Store());
			expect(flux).to.have.property('dispatch')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('process')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('update')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('init')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('state')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('history')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('hook')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('unhook')
				.that.is.an.instanceof(Function);
		});
	});

	describe('state', () => {
		it('should return state when called', () => {
			let { state } = Flux(Store({
				a: Store({
					a: Reducer(0),
					b: Reducer('')
				}),
				b: Store({
					a: Reducer({}),
					b: Reducer([])
				})
			}));

			expect(state()).to.deep.equal({
				a: { a: 0, b: '' },
				b: { a: {}, b: [] }
			});
		});
		it('should return state when called', () => {
			let { state } = Flux(Reducer(0));
			expect(state()).to.equal(0);
		});
		it('should not change when data is not modified', () => {
			let { state } = Flux(Store({
				a: Store({
					a: Reducer(0),
					b: Reducer('')
				}),
				b: Store({
					a: Reducer({}),
					b: Reducer([])
				})
			}));
			expect(state()).to.equal(state());
		});
	});

	describe('dispatch', () => {
		it('should update state when called', () => {
			let { dispatch, state } = Flux(Store({
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
			let { dispatch, state } = Flux(Store({
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
		it('should dispatch argument lists', () => {
			let { dispatch, state } = Flux(Store({
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			}));

			dispatch({ type: TYPES.A }, { type: TYPES.B });
			expect(state()).to.deep.equal({
				a: 0,
				b: 'ab'
			});
		});
		it('should not call hooks when nothing is passed', () => {
			let { dispatch, hook } = Flux(Store({
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
			let { dispatch, hook } = Flux(Store({
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

	describe('rehydrate', () => {
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

				let { dispatch, state, history } = Flux(Store(stores));
				dispatch({ type: TYPES.A }, { type: TYPES.B });

				let lastState = state(),
					lastHistory = history();

				let { process, state: state2 } = Flux(Store(stores));
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

				let { dispatch, state } = Flux(Store(stores));
				dispatch({ type: TYPES.A }, { type: TYPES.B });

				let lastState = state();

				let { state: state2 } = Flux(stores, lastState);

				expect(state2()).to.deep.equal(lastState);
				expect(state2()).to.equal(lastState);
			});
		});
	});

	describe('history', () => {
		it('should be updated on dispatch', () => {
			let { dispatch, history } = Flux(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			dispatch({ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS });
			expect(history()).to.deep.equal([{ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS }]);
		});
	});

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

});
