/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { Interface, Factory, Store, Reducer, Mapware } from '..';

chai.use(spies);

const TYPES = {
	A: 'A',
	B: 'B',
	BOGUS: 'BOGUS'
};

describe('Flux', () => {

	let flux = new Interface();

	describe('factory', () => {
		it('should properly construct flux class', () => {
			flux.instance = Factory();
			expect(flux).to.have.property('dispatch')
				.that.is.an.instanceof(Function);
			expect(flux).to.have.property('process')
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
		it('should take autocreate Store if object is passed', () => {
			flux.instance = Factory({
				a: Reducer(0)
			});
			expect(flux.state()).to.deep.equal({ a: 0 });
		});
	});

	describe('state', () => {
		it('should return state when called', () => {
			flux.instance = Factory(Store({
				a: Store({
					a: Reducer(0),
					b: Reducer('')
				}),
				b: Store({
					a: Reducer({}),
					b: Reducer([])
				})
			}));

			expect(flux.state()).to.deep.equal({
				a: { a: 0, b: '' },
				b: { a: {}, b: [] }
			});

			flux.instance = Factory(Reducer(0));
			expect(flux.state()).to.equal(0);
		});
		it('should not change when data is not modified', () => {
			flux.instance = Factory(Store({
				a: Store({
					a: Reducer(0),
					b: Reducer('')
				}),
				b: Store({
					a: Reducer({}),
					b: Reducer([])
				})
			}));
			expect(flux.state()).to.equal(flux.state());
		});
	});

	describe('dispatch', () => {
		it('should update state when called', () => {
			flux.instance = Factory({
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			});

			flux.dispatch({ type: TYPES.A });
			expect(flux.state()).to.deep.equal({
				a: 1,
				b: 'a'
			});
			flux.dispatch({ type: TYPES.B });
			expect(flux.state()).to.deep.equal({
				a: 0,
				b: 'ab'
			});
		});
		it('should dispatch arrays', () => {
			flux.instance = Factory({
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			});

			flux.dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
			expect(flux.state()).to.deep.equal({
				a: 0,
				b: 'ab'
			});
		});
		it('should dispatch argument lists', () => {
			flux.instance = Factory({
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			});

			flux.dispatch({ type: TYPES.A }, { type: TYPES.B });
			expect(flux.state()).to.deep.equal({
				a: 0,
				b: 'ab'
			});
		});
		it('should not dispatch when nothing is passed', () => {
			flux.instance = Factory({
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			});

			let spy = chai.spy(() => {});
			flux.hook(spy);
			flux.dispatch();
			expect(spy).not.to.have.been.called;
		});
		it('should not dispatch when non-Objects are passed', () => {
			flux.instance = Factory({
				a: Reducer(0, {
					[TYPES.A]: state => state + 1,
					[TYPES.B]: state => state - 1
				}),
				b: Reducer('', {
					[TYPES.A]: state => state + 'a',
					[TYPES.B]: state => state + 'b'
				})
			});

			let spy = chai.spy(() => {});
			flux.hook(spy);
			flux.dispatch(undefined, [0, false, null]);
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

				flux.instance = Factory(stores);
				flux.dispatch({ type: TYPES.A }, { type: TYPES.B });

				let oldstate = flux.state(),
					history = flux.history();

				flux.instance = Factory(stores);
				flux.process(history);

				expect(flux.state()).to.deep.equal(oldstate);
				expect(flux.state()).not.to.equal(oldstate);
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

				flux.instance = Factory(stores);
				flux.dispatch({ type: TYPES.A }, { type: TYPES.B });

				let oldstate = flux.state();

				flux.instance = Factory(stores);
				flux.init(oldstate);

				expect(flux.state()).to.equal(oldstate);
			});
		});
	});

	describe('history', () => {
		it('should be updated on dispatch', () => {
			flux.instance = Factory(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			flux.dispatch({ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS });
			expect(flux.history()).to.deep.equal([{ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS }]);
		});
	});

	describe('hook', () => {
		it('should call listeners by the number of valid dispatches', () => {
			flux.instance = Factory(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			let spy = chai.spy(() => {});
			flux.hook(spy);
			flux.dispatch({ type: TYPES.A }, { type: TYPES.B });
			flux.dispatch();
			flux.dispatch(false, null);
			flux.dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
			flux.dispatch({ type: TYPES.A });
			expect(spy).to.have.been.called.exactly(3);
		});
		it('should call listeners with (state, actions)', () => {
			flux.instance = Factory(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			let spy = chai.spy((state, actions) => {
				expect(actions).to.deep.equal([{ type: TYPES.A }, { type: TYPES.B }, { type: TYPES.BOGUS }]);
				expect(state).to.equal(flux.state());
			});
			flux.hook(spy);
			flux.dispatch([{ type: TYPES.A }, { type: TYPES.B }], { type: TYPES.BOGUS });
			expect(spy).to.have.been.called.once;
		});
	});

	describe('unhook', () => {
		it('should not call listeners after unhook', () => {
			flux.instance = Factory(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			let spy = chai.spy(() => {});
			flux.hook(spy);
			flux.dispatch({ type: TYPES.A }, { type: TYPES.B });
			flux.dispatch();
			flux.dispatch(false, null);
			flux.dispatch([{ type: TYPES.A }, { type: TYPES.B }]);
			flux.unhook(spy);
			flux.dispatch({ type: TYPES.A });
			expect(spy).to.have.been.called.twice;
		});
	});

	describe('Mapware', () => {
		it('can be used as a hook', () => {
			flux.instance = Factory(Reducer(0, {
				[TYPES.A]: state => state + 1,
				[TYPES.B]: state => state - 1
			}));

			let spy = chai.spy(() => {});
			let ware = chai.spy(Mapware({
				[TYPES.A]: spy
			}));
			flux.hook(ware);
			flux.dispatch({ type: TYPES.A });
			flux.dispatch({ type: TYPES.B });
			expect(ware).to.have.been.called.twice;
			expect(spy).to.have.been.called.once;
		});
	});
});
