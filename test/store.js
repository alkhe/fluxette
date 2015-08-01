/* global describe beforeEach it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { Store } from '..';

chai.use(spies);

let TYPES = {
	INC: 'INC',
	DEC: 'DEC'
};

describe('Store', () => {

	let inc, dec, store;

	beforeEach(() => {
		inc = chai.spy((action, state) => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		dec = chai.spy((action, state) => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		store = Store({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});
	});

	it('should return state when called', () => {
		expect(store()).to.have.property('num', 0);
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
});
