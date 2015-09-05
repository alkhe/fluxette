/* global describe it */
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Shape } from '..';

chai.use(spies);

describe('index', () => {
	it('should properly construct flux object', () => {
		let flux = Flux(Shape());
		expect(flux).to.have.property('dispatch')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('use')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('state')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('hook')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('unhook')
			.that.is.an.instanceof(Function);
	});
});
