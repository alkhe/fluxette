import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { Store } from '..';

chai.use(spies);

let TYPES = {
	INC: 'INC',
	DEC: 'DEC'
}

describe('Store', () => {

	let inc, dec, store;

	beforeEach(() => {
		inc = chai.spy((state, action) => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		dec = chai.spy((state, action) => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		store = Store({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});
	});

	it('should return state when called', () => {
		expect(store()).to.have.property('num', 0);
	});

	it('should return same state when if not modified', () => {
		expect(store()).to.equal(store());
	});

	it('should call appropriate reducer when called', () => {
		store({ type: TYPES.INC });
		expect(inc).to.have.been.called();
		expect(dec).not.to.have.been.called();
	});

	it('should have appropriate state when called', () => {
		expect(store({ type: TYPES.INC })).to.have.property('num', 1);
		expect(store({ type: TYPES.INC })).to.have.property('num', 2);
		expect(store({ type: TYPES.DEC })).to.have.property('num', 1);
		expect(store({ type: TYPES.DEC })).to.have.property('num', 0);
	});

	it('should process array of actions in order', () => {
		expect(store([{ type: TYPES.INC }, { type: TYPES.INC }, { type: TYPES.INC }, { type: TYPES.DEC }, { type: TYPES.DEC }, { type: TYPES.DEC }]))
			.to.have.property('history')
			.that.deep.equals([0, 1, 2, 3, 2, 1]);
	});
});
