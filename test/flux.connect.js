import React, { addons } from 'react/addons';
import chai, { expect } from 'chai';
import Flux, { Store } from '..';

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
		flux = new Flux({
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
					let { state: { user } } = this;
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
		})
		it('should hook component with specifier', () => {
			@flux.connect(state => state.user)
			class Component extends React.Component {
				submit() {
					let username = React.findDOMNode(this.refs.username).value;
					let email = React.findDOMNode(this.refs.email).value;
					flux.dispatch({ type: TYPES.USER.SETNAME, name: username }, { type: TYPES.USER.SETEMAIL, email });
				}
				render() {
					let { state: user } = this;
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
		})
	})
});
