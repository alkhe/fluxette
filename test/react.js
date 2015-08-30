/* global describe it */
import React, { addons, PropTypes } from 'react/addons';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import Flux, { Shape, Reducer, Context, connect, select } from '..';

chai.use(spies);

let { TestUtils: { Simulate, renderIntoDocument, findRenderedComponentWithType } } = addons;

const USER = {
	SETNAME: 'USER_SETNAME',
	SETEMAIL: 'USER_SETEMAIL'
};

describe('React', () => {

	it('should hook component without specifier', () => {
		let flux = Flux(Shape({
			user: Reducer({ username: '', email: '' }, {
				[USER.SETNAME]: (state, action) => ({ ...state, username: action.name }),
				[USER.SETEMAIL]: (state, action) => ({ ...state, email: action.email })
			})
		}));

		@connect()
		class Component extends React.Component {
			submit() {
				let { dispatch } = this.context.flux;
				let username = React.findDOMNode(this.refs.username).value;
				let email = React.findDOMNode(this.refs.email).value;
				dispatch([{ type: USER.SETNAME, name: username }, { type: USER.SETEMAIL, email }]);
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

		let tree = renderIntoDocument(
			<Context flux={ flux }>
				{ () => <Component /> }
			</Context>
		);
		let c = findRenderedComponentWithType(tree, Component);
		React.findDOMNode(c.refs.username).value = 'fluxette';
		React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
		Simulate.click(React.findDOMNode(c.refs.submit));
		expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
	});
	it('should hook component with specifier', () => {
		let flux = Flux(Shape({
			user: Reducer({ username: '', email: '' }, {
				[USER.SETNAME]: (state, action) => ({ ...state, username: action.name }),
				[USER.SETEMAIL]: (state, action) => ({ ...state, email: action.email })
			})
		}));

		@connect(state => state.user)
		class Component extends React.Component {
			submit() {
				let { dispatch } = this.context.flux;
				let username = React.findDOMNode(this.refs.username).value;
				let email = React.findDOMNode(this.refs.email).value;
				dispatch([{ type: USER.SETNAME, name: username }, { type: USER.SETEMAIL, email }]);
			}
			render() {
				let user = this.state;
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

		let tree = renderIntoDocument(
			<Context flux={ flux }>
				{ () => <Component /> }
			</Context>
		);
		let c = findRenderedComponentWithType(tree, Component);
		React.findDOMNode(c.refs.username).value = 'fluxette';
		React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
		Simulate.click(React.findDOMNode(c.refs.submit));
		expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
	});

	it('should not rerender if data has not changed', () => {
		let spy = chai.spy(() => {});
		let flux = Flux(Shape({
			user: Reducer({ username: '', email: '' }, {
				[USER.SETNAME]: (state, action) => ({ ...state, username: action.name }),
				[USER.SETEMAIL]: (state, action) => ({ ...state, email: action.email })
			})
		}));

		@connect()
		class Component extends React.Component {
			submit() {
				let { dispatch } = this.context.flux;
				let username = React.findDOMNode(this.refs.username).value;
				let email = React.findDOMNode(this.refs.email).value;
				dispatch([{ type: USER.SETNAME, name: username }, { type: USER.SETEMAIL, email }]);
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

		let tree = renderIntoDocument(
			<Context flux={ flux }>
				{ () => <Component /> }
			</Context>
		);
		let c = findRenderedComponentWithType(tree, Component);
		React.findDOMNode(c.refs.username).value = 'fluxette';
		React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
		Simulate.click(React.findDOMNode(c.refs.submit));
		expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
		expect(spy).to.have.been.called.twice;
		flux.dispatch({ type: 'bogus-type' });
		expect(spy).to.have.been.called.twice;
	});

	it('should not rerender if data has not changed with selector', () => {
		let spy = chai.spy(() => {});
		let flux = Flux(Shape({
			user: Reducer({ username: '', email: '' }, {
				[USER.SETNAME]: (state, action) => ({ ...state, username: action.name }),
				[USER.SETEMAIL]: (state, action) => ({ ...state, email: action.email })
			})
		}));

		@connect(select(
			state => state.user,
			user => {
				return { user };
			}
		))
		class Component extends React.Component {
			submit() {
				let { dispatch } = this.context.flux;
				let username = React.findDOMNode(this.refs.username).value;
				let email = React.findDOMNode(this.refs.email).value;
				dispatch([{ type: USER.SETNAME, name: username }, { type: USER.SETEMAIL, email }]);
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

		let tree = renderIntoDocument(
			<Context flux={ flux }>
				{ () => <Component /> }
			</Context>
		);
		let c = findRenderedComponentWithType(tree, Component);
		React.findDOMNode(c.refs.username).value = 'fluxette';
		React.findDOMNode(c.refs.email).value = 'fluxette@fluxette.github.io';
		Simulate.click(React.findDOMNode(c.refs.submit));
		expect(React.findDOMNode(c.refs.email_label).innerHTML).to.equal('fluxette@fluxette.github.io');
		expect(React.findDOMNode(c.refs.username_label).innerHTML).to.equal('fluxette');
		expect(spy).to.have.been.called.twice;
		flux.dispatch({ type: 'bogus-type' });
		expect(spy).to.have.been.called.twice;
	});

	it('should not fail on unmount', () => {
		let flux = Flux(Shape());

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

		@connect()
		class Child extends React.Component {
			render() {
				return <div />;
			}
		}

		let tree = renderIntoDocument(
			<Context flux={ flux }>
				{ () => <Component /> }
			</Context>
		);
		let c = findRenderedComponentWithType(tree, Component);
		Simulate.click(React.findDOMNode(c.refs.toggle));
	});
	it('should include base context types', done => {
		let flux = Flux(Reducer({}));

		@connect()
		class Component extends React.Component {
			static contextTypes = {
				test: PropTypes.object.isRequired
			}
			render() {
				let { context } = this;
				expect(context).to.have.property('flux')
					.that.is.an.instanceof(Object);
				expect(context).to.have.property('test')
					.that.deep.equals({ prop: 'x' });
				done();
				return null;
			}
		}

		class ContextTest extends React.Component {
			static childContextTypes = {
				test: PropTypes.object.isRequired
			}
			getChildContext() {
				return { test: { prop: 'x' } };
			}
			render() {
				return <Component />;
			}
		}

		renderIntoDocument(
			<Context flux={ flux }>
				{ () => <ContextTest /> }
			</Context>
		);
	});
});
