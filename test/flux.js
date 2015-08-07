/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { Bridge, Interface, Fluxette, Store, Reducer } from '..';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('Flux', () => {

	let I = Interface;

	describe('default', () => {
		it('should properly construct flux class', () => {
			let flux = Bridge(I, Store());
			expect(flux).to.have.property('instance');
			expect(flux.instance instanceof Fluxette).to.be.true;
			expect(flux).to.have.property('dispatch')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('interop')
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
			let { state } = Bridge(I, Store({
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
			let { state } = Bridge(I, Reducer(0));
			expect(state()).to.equal(0);
		});
		it('should not change when data is not modified', () => {
			let { state } = Bridge(I, Store({
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
			let { dispatch, state } = Bridge(I, Store({
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
			let { dispatch, state } = Bridge(I, Store({
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
			let { dispatch, state } = Bridge(I, Store({
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
			let { dispatch, hook } = Bridge(I, Store({
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
			let { dispatch, hook } = Bridge(I, Store({
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

				let { dispatch, state, history } = Bridge(I, Store(stores));
				dispatch({ type: TYPES.A }, { type: TYPES.B });

				let lastState = state(),
					lastHistory = history();

				let { process, state: state2 } = Bridge(I, Store(stores));
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

				let { dispatch, state } = Bridge(I, Store(stores));
				dispatch({ type: TYPES.A }, { type: TYPES.B });

				let lastState = state();

				let { state: state2 } = Bridge(I, stores, lastState);

				expect(state2()).to.deep.equal(lastState);
				expect(state2()).to.equal(lastState);
			});
		});
	});

	describe('history', () => {
		it('should be updated on dispatch', () => {
			let { dispatch, history } = Bridge(I, Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			dispatch({ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS });
			expect(history()).to.deep.equal([{ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS }]);
		});
	});

	describe('hook', () => {
		it('should call listeners by the number of valid dispatches', () => {
			let { dispatch, hook } = Bridge(I, Reducer(0, {
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
			let { dispatch, state: getState, hook } = Bridge(I, Reducer(0, {
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
			let { dispatch, hook, unhook } = Bridge(I, Reducer(0, {
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

	describe('middleware', () => {
		it('should extend Interface', () => {
			let mw = Generic =>
				class extends Generic {
					constructor(...args) {
						super(...args);
						this.mwhistory = [];
					}
					interop(actions) {
						this.mwhistory.push(actions);
						super.interop(actions);
					}
				};
			let G = mw(I);
			let flux = Bridge(G, Store());

			flux.dispatch({ type: 'action-x' }, { type: 'action-y' }, { type: 'action-z' });
			flux.dispatch({ type: 'action-a' }, [{ type: 'action-b' }], { type: 'action-c' });

			expect(flux.mwhistory).to.deep.equal([[{ type: 'action-x' }, { type: 'action-y' }, { type: 'action-z' }], [{ type: 'action-a' }, { type: 'action-b' }, { type: 'action-c' }]]);

			expect(I.isPrototypeOf(G)).to.be.true;
		});
		it('should be composable', () => {
			let mw = Generic =>
				class extends Generic {
					constructor(...args) {
						super(...args);
						this.mwhistory = [];
					}
					interop(actions) {
						this.mwhistory.push(actions);
						super.interop(actions);
					}
				};
			let mw2 = Generic =>
				class extends Generic {
					constructor(...args) {
						super(...args);
						this.mwhistory2 = [];
					}
					interop(actions) {
						this.mwhistory.push('x');
						this.mwhistory2.push(...actions);
						super.interop(actions);
					}
				};

			let G = mw2(mw(I));
			let flux = Bridge(mw2(mw(I)), Store());

			flux.dispatch({ type: 'action-x' }, { type: 'action-y' }, { type: 'action-z' });
			flux.dispatch({ type: 'action-a' }, [{ type: 'action-b' }], { type: 'action-c' });

			expect(flux.mwhistory).to.deep.equal(['x', [{ type: 'action-x' }, { type: 'action-y' }, { type: 'action-z' }], 'x', [{ type: 'action-a' }, { type: 'action-b' }, { type: 'action-c' }]]);
			expect(flux.mwhistory2).to.deep.equal([{ type: 'action-x' }, { type: 'action-y' }, { type: 'action-z' }, { type: 'action-a' }, { type: 'action-b' }, { type: 'action-c' }]);

			expect(I.isPrototypeOf(G)).to.be.true;
		});
		it('should be isolated from other interfaces', () => {
			let mw = Generic =>
				class extends Generic {
					constructor(...args) {
						super(...args);
						this.mwhistory = [];
					}
					interop(actions) {
						this.mwhistory.push(actions);
						super.interop(actions);
					}
				};
			let G = mw(I);
			let flux = Bridge(G, Store());

			flux.dispatch({ type: 'action-x' }, { type: 'action-y' }, { type: 'action-z' });
			flux.dispatch({ type: 'action-a' }, [{ type: 'action-b' }], { type: 'action-c' });

			flux = Bridge(G, Store());
			expect(flux.mwhistory).to.deep.equal([]);
		});
	});

});
