/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Shape from 'reducer/shape';
import Leaf from 'reducer/leaf';
import Filter from 'reducer/filter';

chai.use(spies);

let TYPES = {
	INC: 'INC',
	DEC: 'DEC'
};

describe('Leaf', () => {

	it('should return state when called', () => {
		let inc = chai.spy(state => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		let dec = chai.spy(state => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		let store = Leaf({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});
		expect(store()).to.have.property('num', 0);
	});

	it('should call appropriate reducer when called', () => {
		let inc = chai.spy(state => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		let dec = chai.spy(state => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		let state;
		let store = Leaf({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});

		store(state, { type: TYPES.INC });
		expect(inc).to.have.been.called();
		expect(dec).not.to.have.been.called();
	});

	it('should have appropriate state when called', () => {
		let inc = chai.spy(state => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		let dec = chai.spy(state => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		let state;
		let store = Leaf({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});

		expect(state = store(state, { type: TYPES.INC })).to.have.property('num', 1);
		expect(state = store(state, { type: TYPES.INC })).to.have.property('num', 2);
		expect(state = store(state, { type: TYPES.DEC })).to.have.property('num', 1);
		expect(state = store(state, { type: TYPES.DEC })).to.have.property('num', 0);
	});
});

describe('Shape', () => {

	it('should compose reducers', () => {
		let inc = chai.spy(state => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		let dec = chai.spy(state => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		let state;

		let reducer = Leaf({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});

		let store = Shape({
			domain: reducer
		});

		expect((state = store(state).domain)).to.have.property('num', 0);
	});
});

describe('Filter', () => {

	it('should proxy to reducers only accepted actions', () => {
		let inc = chai.spy(state => ({ ...state, num: state.num + 1, history: state.history.concat(state.num) }));
		let dec = chai.spy(state => ({ ...state, num: state.num - 1, history: state.history.concat(state.num) }));

		let state, newstate;

		let reducer = Leaf({ num: 0, history: [] }, {
			[TYPES.INC]: inc,
			[TYPES.DEC]: dec
		});

		let store = Shape({
			domain: Filter([TYPES.DEC], reducer)
		});

		expect((state = store(state, { type: TYPES.INC })).domain).to.have.property('num', 0);
		newstate = store(state, { type: TYPES.INC });
		expect(newstate).to.equal(state);
		expect(state.domain).to.have.property('num', 0);
		expect((state = store(state, { type: TYPES.DEC })).domain).to.have.property('num', -1);
		expect((state = store(state, { type: TYPES.DEC })).domain).to.have.property('num', -2);
	});
});
