# fluxette

`fluxette` is a minimalist yet powerful Flux implementation, inspired by ideas from [Dan Abramov (@gaearon)'s talk on Redux](https://www.youtube.com/watch?v=xsSnOQynTHs).

## Table of Contents

* [Why?](#why)
* [Install](#install)
* [Getting Started](#getting-started)
* [API](#api)
* [Glossary](#glossary)
* [The Law of Functional Flux](#the-law-of-functional-flux)
* [Middleware](#middleware)
* [Rehydration](#rehydration)
* [Debugging](#debugging)
* [SSR](#ssr)
* [Asynchronous](#asynchronous)
* [Optimistic Updates](#optimistic-updates)
* [Store Dependencies](#store-dependencies)
* [Store Composition](#store-composition)
* [Examples](#examples)
* [Testing](#testing)
* [Todo](#todo)
* [Influences](#Influences)

## Why?

Why fluxette? (We used to have a list of buzzwords here.)

"fluxette" means "little flux". That's exactly what it is, coming in at ~3 kB, minified and gzipped. It is a library that combines the advantages of orthogonal code with the robust design of Facebook Flux. Through simple rules, it allows for the creation and exploitation of very advanced design patterns. It relies only on the basic convention that your stores are pure functions in the form of `(State, Action) => State` (see [The Law of Functional Flux](#the-law-of-functional-flux)). As a result, its dispatcher exists as [one simple line](https://github.com/edge/fluxette/blob/master/src/flux.js#L32). fluxette provides facilities for elements of Functional Flux that will cover most of your use cases, but it is always possible to defer to writing a custom function if the need arises. This also makes migrating from other implementations in the family of functional Flux very easy (e.g. copy-paste from redux).

fluxette removes many of the headaches that you may have had with React and other flux implementations, such as Store dependencies (`waitFor`), superfluous `setState`s ("did the state really change?" and "I'm not done dispatching yet!"), listening to finer and coarser-grained updates, [`Uncaught Error: Invariant Violation: Dispatch.dispatch(...)`](http://i.imgur.com/YnI9TIJ.jpg), and more. With two React helpers, integrating Flux into your components no longer requires complicated mixins or lots of boilerplate.

## Install

```sh
$ npm i --save fluxette
```
[Browser builds (umd) are also available.](https://github.com/edge/fluxette/tree/master/dist)

## Getting Started

Say you have a simple React component that you want to refactor with Flux:

```js
class Updater extends React.Component {
	constructor() {
		super();
		this.state = {
			text: ''
		};
	}
	change(e) {
		this.setState({ text: e.target.value });
	}
	render() {
		return (
			<div>
				<input onChange={ ::this.change } />
				<div>{ this.state.text }</div>
			</div>
		);
	}
}

React.render(<Updater />, document.getElementById('root'));
```

This is a simple component that shows you the text that you've typed into a textbox right below it. We can interpret our event as an action of type `UPDATE` that carries the value of the textbox.

```js
// constants
const UPDATE = 'UPDATE';

// actions
const update = value => ({ type: UPDATE, value });
```

We'll also need a Reducer to manage our state.

```js
import Flux, { Reducer } from 'fluxette';

// reducer store
const updater = Reducer('', {
	[UPDATE]: (state, action) => action.value
});

// flux interface
const flux = Flux(updater);
```

`Reducer` creates a pure function that looks at your actions and uses them to determine how to operate on the state. Our Reducer's default value is an empty string, just like in our `Updater` component. It listens to any actions of the type `UPDATE`, and uses the value that the action carries as our new state.

We also create a stateful interface to our reducer, which we can now integrate into our component.

**Putting it all together**

Here we import two things: the `@connect` decorator and the `Context` component. `Context` provides flux on `this.context` to all of its children, which `@connect` then utilizes to manage listeners on your component.

```js
import React from 'react';
import Flux, { Reducer, Context, connect } from 'fluxette';

// constants
const UPDATE = 'UPDATE';

// actions
const update = value => ({ type: UPDATE, value });

// reducer store
const updater = Reducer('', {
	[UPDATE]: (state, action) => action.value
});

// flux interface
const flux = Flux(updater);

@connect(state => ({ text: state }))
class Updater extends React.Component {
	change(e) {
		let { dispatch } = this.context.flux;
		dispatch(update(e.target.value));
	}
	render() {
		return (
			<div>
				<input onChange={ ::this.change } />
				<div>{ this.state.text }</div>
			</div>
		);
	}
}

React.render(
	<Context flux={ flux }>
		{ () => <Updater /> }
	</Context>,
	document.getElementById('root')
);
```

## API

**Flux(reducer)**
Creates your central Flux object that manages the dispatcher and state. Its methods can be called anonymously.

```js
import Flux from 'fluxette';
import stores from './stores';

const flux = Flux(stores);
```

**flux.init(state)**
Resets the Flux object with `state`, or uses the default state returned by the store if `state` is undefined. This is used for things like time travel and declarative rehydration.

```js
flux.init(getStateFromServer());
```

**flux.dispatch(...actions)**
Processes `actions` and calls all listeners. `actions` can be any Object, array of Objects, or argument list of Objects. If you use middleware, that includes Functions, Promises, and others.

```js
flux.dispatch({ type: 'MY_ACTION_TYPE', data: 'x' });

// thunks
import { thunk } from 'fluxette';
flux.use(thunk);
flux.dispatch(({ dispatch }) => {
	// useful if this function came from somewhere else
	dispatch({ type: 'MY_ACTION_TYPE', data: 'x' });
})
```

**flux.process(actions, [normalized])**
Processes `actions`, but doesn't call listeners. `actions` are in the same format that `dispatch` uses. If you are sure that `actions` is a flat array of actions, you can pass `true` as the second argument. This is useful for time travel and buffered updates.

```js
flux.process([action1, action2, action3], true);
```

**flux.update()**
Calls all listeners that are `hook`ed. `dispatch` uses this.

```js
flux.update();
```

**flux.use(...middleware)**
Takes an argument list of middleware and folds them over the internal dispatcher function. This can be called multiple times.

```js
flux.use(thunk, promise);
```

**flux.state()**
Returns the state.

```js
flux.state();
```

**flux.history()**
Returns all actions that have been processed by the reducers.

```js
flux.history();
```

**flux.hook(fn)**
Register a function as a listener.

```js
flux.hook((state, actions) => {
	console.log(state, actions);
});
```

**flux.unhook(fn)**
Deregister a function that was previously registered as a listener.

```js
let fn = (state, actions) => {
	console.log(state, actions);
};

flux.hook(fn);

flux.unhook(fn);
```

**Shape(shape)**
Creates a reducer that holds more reducers on each of its properties. The property names reflect how they will appear on the state.

```js
import { Shape } from 'fluxette';
import { stock, cart } from './reducers';

let store = Shape({ stock, cart });

user()
// { stock: stock(), cart: cart() }
```

**Reducer(initial, reducers)**
Creates a reducer that applies its reducers to a state respective to the type of the action provided, using `initial` as the initial state.

```js
import { Reducer } from 'fluxette';
import { API } from './types';

let request = Reducer({ status: 'ready' }, {
	[API.REQUEST]: state => ({ status: 'loading' }),
	[API.DONE]: (state, action) => ({ status: 'done', data: action.data }),
	[API.FAIL]: (state, action) => ({ status: 'error', error: action.error })
});
```

**Filter(types, reducer)**
Creates a reducer that proxies its action to its reducers only if the action's type matches one of its types.

```js
import { Filter } from 'fluxette';
import { USER } from './types';

user = Filter([USER.LOGIN, USER.LOGOUT, USER.CHAT], user);
```

**Context**
Extends a React component to provide a Flux object on the context to all of its children.

```js
import { Context } from 'fluxette';
import App from './app';
import flux from './flux';

React.render(
	<Context flux={ flux }>
		{ () => <App /> }
	</Context>,
	document.getElementById('root')
);
```

**connect([selectors])**
Extends a Component to manage listeners to the Flux object on `this.context`, and performs a `setState` when the state changes. It also takes an optional selector or array of selectors, which make the state more specific. It will only update when the selector returns a new value.

```js
import { connect } from 'fluxette';
import { details } from './creators';

@connect(state => state.details)
class Component extends React.Component {
	submit() {
		let { dispatch } = this.context.flux;
		dispatch(details.update({
			nickname: React.findDOMNode(this.refs.nickname).value,
			email: React.findDOMNode(this.refs.email).value
		}));
	}
	render() {
		let details = this.state;
		return (
			<div>
				<input ref='nickname' defaultValue={ details.nickname } />
				<input ref='email' defaultValue={ details.email } />
				<button onClick={ ::this.submit }>Submit</button>
			</div>
		);
	}
}
```

**select(getters, deriver)**
Creates a selector that caches the results of the `getters` array, which are applied to `deriver` as an argument list. It only returns a new value when the getters have returned new data, which is useful for data computations that would break equality checks otherwise.

```js
import { select } from 'fluxette';

let itemsWith = {
	discount: state => state.products.onSale,
	warranty: state => state.products.warranted,
	highRating: state => state.products.highRated
};

let userProducts = select(
	[itemsWith.discount, itemsWith.warranty],
	(discounted, warranted) => ({ products: _.union(discounted, warranted) })
);
```

## Glossary

**State**
A *State* is any value that is representative of your application. It can be a primitive, Object, Array, or anything else. If you wish to implement de/rehydration, you may want to keep JSON serialization in mind.

**Action**
An *Action* is an Object that contains information on how to update the state. Customarily, they have a `type` property, along with any other data that your stores may need to operate on the state.

**Action Creator**
*Action Creators* are not internally known by fluxette, but are usually used in Flux applications to parametrize actions. By the norm of Functional Flux, they are functions that return *Actions*.

**Reducer**
A *Reducer* (or *Store*) is a pure function that accepts a state and an action, which it combines, or *reduces*, to create a new state. All Reducers should have the signature `(State, Action) => State`. The `Shape`, `Reducer`, and `Filter` facilities all return a Reducer.

**Hook**
*Hooks* (or *Listeners*) are functions that respond to a change in the state. They have a wide spectrum of uses; they are similar to the `change` event listeners of a traditional MVC framework. They have a signature of `(?State, ?Array<Action>) => void`. The `connect` decorator uses a hook to subscribe your components to state changes.

**Selector**
A *Selector* is a function that takes a state and makes it more specific. Selectors are very useful in React components, to keep your `render` method DRY and orthogonal, and to take advantage of caching features. For more advanced caching, you can use the `select` facility, which also returns a Selector. Selectors have the signature `(State) => State`.

**Deriver**
The *Deriver* is an concept specific to the `select` facility. `select` takes a Selector or an array of Selectors, and passes the results of each to the deriver to create a logical (as opposed to raw) data object that your application uses. Derivers are functions that expect the results of Selectors and returns a State.

## The Law of Functional Flux
In the most general sense, Functional Flux relies on reducing actions into the state. Therefore, Stores or Reducers are pure functions with the signature `(State, Action) => State`. If a Store processes an action that it listens to, which results in a different state, it returns a value or reference that differs from the state that it was called with. This recursively cascades down to the root of the state tree. At the end of the dispatch, all listeners are called. Any of which that depend on data that could have possibly changed are called with new values or references. Thus, listeners can simply maintain a reference to the old state and compare with the new one to determine whether the state has changed.

## Middleware
Middleware can extend the functionality of the dispatcher by accommodating functions, Promises, and other data structures, allowing for advanced asynchronous and multiplexing functionality. Middleware do not require knowledge of other middleware, which makes them easily composable. To use middleware, pass a list of them to `flux.use`.

```js
import { thunk, promise } from 'fluxette';

flux.use(thunk, promise);
```

### Writing Middleware
Middleware is implemented as a *creator* function that takes a `next` argument, which returns a *dispatcher* function that takes an `action` argument. The middleware is bound to the Flux object, so methods such as `dispatch` are available on `this`. To accommodate this, a *creator* cannot be an arrow function. Unless you need to break the dispatch pipeline, you should call `next` to pass the action on to the next *dispatcher* function. A valid breakage of the pipeline can be seen in the Promise middleware, where it passes `this.dispatch` to the `Promise#then`. It is good practice to return the value of your last call, whether it may be a `next`, `then`, or other call.

## Rehydration
`fluxette` supports both imperative and declarative rehydration. You may pick whichever suits your needs more.

**Imperative**
```js
flux.dispatch(actions);
// dehydrating
let history = flux.history();
sendToServer({ history });
// rehydrating
let { history } = getFromServer();
flux.process(history);
```

This example uses the `process` method, which skips all middleware.

**Declarative**
```js
flux.dispatch(actions);
// dehydrating
let state = flux.state();
sendToServer({ state });
// rehydrating
let { state } = getFromServer();
flux.init(state);
```

If, for any reason you wanted to use both methods, this is one possible way:

**Mux**
```js
let old = flux.state();
flux.dispatch(actions);
// dehydrating
let history = flux.history();
sendToServer({ state: old, history });
// rehydrating
let { state, history } = getFromServer();
flux.init(state);
flux.process(history);
```

## Debugging

**To log all actions in raw form, as `dispatch` is directly called with:**
Add a logger to the beginning of your middleware chain. This will log all actions before they are possibly transformed by other middleware.

```js
flux.use(
	function(next) {
		return action => {
			console.log(this.state(), action);
			next(action);
		}
	},
	...middleware
);
```

**To log all actions just before the store reduces them:** Add a logger to the end of your middleware chain. This will log only actions that the stores see, and will be logged to the history.

```js
flux.use(
	...middleware,
	function(next) {
		return action => {
			console.log(this.state(), action);
			next(action);
		}
	}
);
```


**To log all actions after they are reduced into the stores:** Pass your logger/debugger to `hook` and `unhook` when you're done.

```js
let logger = (state, actions) => {
	console.log(state, actions);
	sendToDashboard(state);
	alertTimeMachine(actions);
}

flux.hook(logger);

flux.unhook(logger);
```

## SSR
Universal flux is very easy. Because `fluxette` doesn't force you to use use singletons, you can create new instances on the fly.

```js
import Flux from 'fluxette';
import stores from './stores';
import App from './views';

server.route('/', (req, res) => {
	let flux = Flux(stores);
	res.end(React.renderToString(
		<Context flux={ flux }>
			{ () => <App /> }
		</Context>
	));
})
```

## Asynchronous
fluxette is completely synchronous, but asynchronous functionality is also supported. `thunk` and `promise` middlewares are provided for you to use.

One way to use the thunk middleware is to use an async action that combines actions:
```js
import { thunk } from 'fluxette';

let { dispatch, use } = flux;
use([thunk]);

// actions
let resource = {
	request: () => { type: RESOURCE.REQUEST },
	done: data => { type: RESOURCE.DONE, data },
	fail: err => { type: RESOURCE.FAIL, err }
};

// async action
let getResource = (data) => {
	({ dispatch }) => {
		dispatch(resource.request());
		asyncRequest(data.url, (err, res) => {
			if (err) {
				dispatch(resource.fail(err));
			}
			else {
				dispatch(resource.done(res));
			}
		});
	}
}

dispatch(getResource(data));
```

Another way is to return an array of actions directly from the action creator:
```js
import { thunk } from 'fluxette';

let { dispatch, use } = flux;
use(thunk);

let resource = data => [
	{ type: RESOURCE.REQUEST },
	({ dispatch }) => {
		asyncRequest(data.url, (err, data) => {
			if (err) {
				dispatch({ type: RESOURCE.FAIL, err });
			}
			else {
				dispatch({ type: RESOURCE.SUCCESS, data });
			}
		});
	}
];

dispatch(getResource(data));
```

## Optimistic Updates
Using the design pattern outlined in [Asynchronous](#asynchronous), the preemptive *request* action can be used for optimistic updates on an asynchronous write from the client. If the write completed successfully, the *success* action can then be dispatched, without the user experiencing any latency. If the write failed, a *failure* action can be dispatched to easily rollback the changes from the optimistic update.

```js
import { thunk, Reducer } from 'fluxette';

let { dispatch, use } = flux;
use(thunk);

let setMessage = (messages, { message }) => ({
	...messages,
	[message.id]: message
});
let messageReducer = Reducer({}, {
	[MESSAGE.REQUEST]: setMessage,
	[MESSAGE.SUCCESS]: setMessage,
	[MESSAGE.FAILURE]: (messages, { message }) => {
		let { [message.id]: remove, ...rollback } = messages;
		return rollback;
	}
});

let sendMessage = message => [
	{ type: MESSAGE.REQUEST, message },
	({ dispatch }) => {
		sendToServer(message, (err, message) => {
			if (err) {
				dispatch({ type: RESOURCE.FAIL, err });
			}
			else {
				dispatch({ type: RESOURCE.SUCCESS, message });
			}
		});
	}
];

dispatch(sendMessage(message));
```

## Store Dependencies
Store dependencies in vanilla flux is handled by using `waitFor`, but `waitFor` is hard to trace, and may result in unpredictable application behavior, such as infinite loops. The fluxette way to handle store dependencies is to instead split an action into two semantic actions, which will be dispatched in order. This is known as action splitting, and it allows for declarative store dependencies, simultaneously improving clarity and preventing any possibility of mutual locks. In most Flux implementations, this would not be a viable solution, as dispatching twice results in an extra setState on each component. Since fluxette allows you to dispatch arrays of actions, atomic action handling is possible, and only one setState is called once the array has been fully processed. A dependency refactor usually should not involve changing component code; you can just make the relevant action creator return an array of actions instead. If you do not want to use action splitting, you can implement a short custom Store instead (see [Store Composition](#store-composition)).

## Store Composition
Because Stores are just pure functions, they can easily be composed and reused.

```js
import { Reducer } from 'fluxette';

let player = Reducer({ points: 0 }, {
	[PLAYER.ADDPOINTS]: (state, action) => ({ ...state, points: state.points + action.points })
});

let game = (state = { left: {}, right: {} }, action) => {
	if (action.player === LEFT) {
		let left = player(state.left);
		if (left !== state.left) {
			return { ...state, left };
		}
	}
	else if (action.player === RIGHT) {
		let right = player(state.right);
		if (right !== state.right) {
			return { ...state, right };
		}
	}
	return state;
}
```

For simpler use cases, just plug Stores into other Stores.

```js
import { Shape } from 'fluxette';

let users = {};

let dispatchCount = (state = 0) => state + 1;

let store = Shape(users);

// user_029347 joined
users['user_029347'] = dispatchCount;

// after 5 dispatches
state()
// {
//	user_029347: 5
// }

// user_120938 joined
users['user_120938'] = dispatchCount;

// after 2 dispatches
state()
// {
//	user_029347: 7,
//  user_120938: 2
// }
```

## Examples
Examples can be found [here](https://github.com/edge/fluxette/tree/master/examples).

## Testing
```sh
# npm i -g testem mocha
$ npm test
```

## Todo
* separate React facilities into fluxette-react
* write middleware
* add ~~lint~~, code coverage, CI, badges, etc.
* submit to HN

## Influences
* Unix
* @gaearon
* [Alan Baker/Occam's Razor](http://plato.stanford.edu/archives/sum2011/entries/simplicity/#OntPar)
