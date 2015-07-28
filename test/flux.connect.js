/* global describe beforeEach it */
import React, { addons } from 'react/addons';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Store } from '..';

chai.use(spies);

let { TestUtils: { Simulate, renderIntoDocument } } = addons;

const TYPES = {
	USER: {
		SETNAME: 'USER_SETNAME',
		SETEMAIL: 'USER_SETEMAIL'
	}
};

describe('Flux', () => {

	let flux;

	beforeEach(() => {
		flux = Flux({
			user: Store({ username: '', email: '' }, {
				[TYPES.USER.SETNAME]: (state, action) => ({ ...state, username: action.name }),
				[TYPES.USER.SETEMAIL]: (state, action) => ({ ...state, email: action.email })
			})
		});
	});

	describe('connect', () => {
		it('should hook component without specifier', () => {
			@flux.connect()
			class Component extends React.Component {
				submit() {
					let username = React.findDOMNode(this.refs.username).value;
					let email = React.findDOMNode(this.refs.email).value;
					flux.dispatch({ type: TYPES.USER.SETNAME, name: username }, { type: TYPES.USER.SETEMAIL, email });
				}
				render() {
					let { user } = this.state.flux;
					return (
						<div>
							<input ref='username' />
							<input ref='email' />
							<button ref='submit' onClick={ ::this.submit } />
							Username: <span ref='username_label'>{ user.username }</span>
							Email: <span ref='email_label'>{ user.email }</span>
						</div>
					);
				}
			}

			let c = renderIntoDocument(<Component />);
			React.findDOMNode(c.refs.username).value = 'fluxette';
			React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
			Simulate.click(React.findDOMNode(c.refs.submit));
			expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
			expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		});
		it('should hook component with specifier', () => {
			@flux.connect(state => state.user)
			class Component extends React.Component {
				submit() {
					let username = React.findDOMNode(this.refs.username).value;
					let email = React.findDOMNode(this.refs.email).value;
					flux.dispatch({ type: TYPES.USER.SETNAME, name: username }, { type: TYPES.USER.SETEMAIL, email });
				}
				render() {
					let { flux: user } = this.state;
					return (
						<div>
							<input ref='username' />
							<input ref='email' />
							<button ref='submit' onClick={ ::this.submit } />
							Username: <span ref='username_label'>{ user.username }</span>
							Email: <span ref='email_label'>{ user.email }</span>
						</div>
					);
				}
			}

			let c = renderIntoDocument(<Component />);
			React.findDOMNode(c.refs.username).value = 'fluxette';
			React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
			Simulate.click(React.findDOMNode(c.refs.submit));
			expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
			expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		});
		it('should hook component with specifier and identifier', () => {
			@flux.connect(state => state.user, 'user')
			class Component extends React.Component {
				submit() {
					let username = React.findDOMNode(this.refs.username).value;
					let email = React.findDOMNode(this.refs.email).value;
					flux.dispatch({ type: TYPES.USER.SETNAME, name: username }, { type: TYPES.USER.SETEMAIL, email });
				}
				render() {
					let { user } = this.state;
					return (
						<div>
							<input ref='username' />
							<input ref='email' />
							<button ref='submit' onClick={ ::this.submit } />
							Username: <span ref='username_label'>{ user.username }</span>
							Email: <span ref='email_label'>{ user.email }</span>
						</div>
					);
				}
			}

			let c = renderIntoDocument(<Component />);
			React.findDOMNode(c.refs.username).value = 'fluxette';
			React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
			Simulate.click(React.findDOMNode(c.refs.submit));
			expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
			expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		});
		it('should hook component with identifier', () => {
			@flux.connect('store')
			class Component extends React.Component {
				submit() {
					let username = React.findDOMNode(this.refs.username).value;
					let email = React.findDOMNode(this.refs.email).value;
					flux.dispatch({ type: TYPES.USER.SETNAME, name: username }, { type: TYPES.USER.SETEMAIL, email });
				}
				render() {
					let { user } = this.state.store;
					return (
						<div>
							<input ref='username' />
							<input ref='email' />
							<button ref='submit' onClick={ ::this.submit } />
							Username: <span ref='username_label'>{ user.username }</span>
							Email: <span ref='email_label'>{ user.email }</span>
						</div>
					);
				}
			}

			let c = renderIntoDocument(<Component />);
			React.findDOMNode(c.refs.username).value = 'fluxette';
			React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
			Simulate.click(React.findDOMNode(c.refs.submit));
			expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
			expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		});
		it('should setState only if state has changed and domain is store', () => {
			let spy = chai.spy(() => {});

			@flux.connect(state => state.user, 'user')
			class Component extends React.Component {
				submit() {
					flux.dispatch({ type: 'bogus' });
				}
				render() {
					spy();
					let { user } = this.state;
					return (
						<div>
							<input ref='username' />
							<input ref='email' />
							<button ref='submit' onClick={ ::this.submit } />
							Username: <span ref='username_label'>{ user.username }</span>
							Email: <span ref='email_label'>{ user.email }</span>
						</div>
					);
				}
			}

			let c = renderIntoDocument(<Component />);
			expect(spy).to.have.been.called.once;
			React.findDOMNode(c.refs.username).value = 'fluxette';
			React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
			Simulate.click(React.findDOMNode(c.refs.submit));
			expect(spy).to.have.been.called.once;
		});
		it('should unfortunately setState if state has changed and domain is not store', () => {
			let spy = chai.spy(() => {});

			@flux.connect('store')
			class Component extends React.Component {
				submit() {
					flux.dispatch({ type: 'bogus-type' });
				}
				render() {
					spy();
					let { user } = this.state.store;
					return (
						<div>
							<input ref='username' />
							<input ref='email' />
							<button ref='submit' onClick={ ::this.submit } />
							Username: <span ref='username_label'>{ user.username }</span>
							Email: <span ref='email_label'>{ user.email }</span>
						</div>
					);
				}
			}

			let c = renderIntoDocument(<Component />);
			expect(spy).to.have.been.called.once;
			React.findDOMNode(c.refs.username).value = 'fluxette';
			React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
			Simulate.click(React.findDOMNode(c.refs.submit));
			expect(spy).to.have.been.called.twice;
		});
		it('should not fail on unmount', () => {
			@flux.connect()
			class Child extends React.Component {
				render() {
					return <div />;
				}
			}

			class Component extends React.Component {
				constructor() {
					super();
					this.state = {
						show: true
					};
				}
				toggle() {
					this.setState({
						show: !this.state.show
					});
				}
				render() {
					let toggle = <button ref='toggle' onClick={ ::this.toggle } />;
					return this.state.show
						? <div>
							<Child />
							{ toggle }
						</div>
						: <div>{ toggle }</div>;
				}
			}

			let c = renderIntoDocument(<Component />);
			Simulate.click(React.findDOMNode(c.refs.toggle));
		});
	});
});
