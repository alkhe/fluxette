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

describe('index', () => {
	it('should properly construct flux class', () => {
		let flux = Flux(Shape());
		expect(flux).to.have.property('init')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('dispatch')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('process')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('update')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('use')
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
