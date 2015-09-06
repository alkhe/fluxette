/* global describe it */
import { expect } from 'chai';
import Flux from '..';
import Shape from 'reducer/shape';

describe('index', () => {
	it('should properly construct flux object', () => {
		let flux = Flux(Shape());
		expect(flux).to.have.property('reduce')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('dispatch')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('state')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('hook')
			.that.is.an.instanceof(Function);
		expect(flux).to.have.property('unhook')
			.that.is.an.instanceof(Function);
	});
});
