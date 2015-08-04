# fluxette

`fluxette` is a minimalist yet powerful Flux implementation, inspired by ideas from the Unix philosophy and [Dan Abramov (@gaearon)'s talk on Redux](https://www.youtube.com/watch?v=xsSnOQynTHs).

## Table of Contents

* [Why?](#why)
* [Install](#install)
* [Getting Started](#getting-started)
* [API](#api)
* [Middleware](#middleware)
* [Rehydration](#rehydration)
* [Debugging](#debugging)
* [Isomorphic Flux](#isomorphic-flux)
* [Asynchronous](#asynchronous)
* [Store Dependencies](#store-dependencies)
* [Tips](#tips)
* [Examples](#examples)
* [Testing](#testing)
* [Todo](#todo)

## Why?

Why `fluxette`? (We used to have a list of buzzwords here.)

`fluxette` means "little flux". That's exactly what it is, coming in at 2.8 kB, minified and gzipped. But as the great Master Yoda said, *size matters not*. The goal of `fluxette` is to make your React/Flux development experience as smooth as possible. `fluxette` has many recommended practices, but, in accordance with the philosophy of Unix, it does not enforce any "one true way". `fluxette` allows you to do things in many different ways, and is extremely modular and extensible. The codebase is very simple and robust; there is no black magic going on anywhere [(KISS)](https://en.wikipedia.org/wiki/KISS_principle). It only relies on the simple assumption that your stores are pure functions in the form of `(state, action) => state`. As a result, our dispatcher exists as [one very beautiful line](https://github.com/edge/fluxette/blob/master/src/flux.js#L17). `fluxette` provides factories for elements of Flux that will cover 99% of your use cases, but you can always defer to writing a custom function if the need arises. This also makes migrating from other implementations in the family of functional Flux very easy (e.g. copy-paste from redux).

`fluxette` also removes many of the headaches that you may have had with React and other flux implementations, such as Store dependencies (`waitFor`), superfluous `setState`s ("when did the state really change?" and "I'm not done dispatching yet!"), listening to finer and coarser-grained updates, [`Uncaught Error: Invariant Violation: Dispatch.dispatch(...)`](http://i.imgur.com/YnI9TIJ.jpg), and more. With two simple React class decorators, connecting your components with `fluxette` no longer requires complicated mixins.

You can also easily extend the `fluxette` interface, allowing you to add your own functionality to the dispatcher (Middleware for async, thunks, Promises) at will.

## Install

```sh
$ npm i --save fluxette
```
Browser builds (umd) are available [here](https://github.com/edge/fluxette/tree/master/dist).

## Getting Started

Let's say that you have a simple React component that you want to add Flux to.

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

React.render(<Updater />, document.getElementById('app'));
```

This is a simple component that shows you the text that you've typed into a textbox right below it. We can interpret this as an action of type `UPDATE_TEXT`, with the value of the textbox being the payload.

```js
// constants
const UPDATE = { TEXT: 'UPDATE_TEXT' };

// actions
const update = { text: value => ({ type: UPDATE_TEXT, value }) };
```

Now we'll need a Reducer to manage our state.

```js
import Flux, { Reducer } from 'fluxette';

// reducer store
const updater = Reducer('', {
	[UPDATE.TEXT]: (state, action) => action.value
});

// flux interface
const flux = Flux(updater);
```

`Reducer` creates a pure function that looks at your actions and determines how to modify the state based on them. Its default value is an empty string, just like in our `Updater` component. In our case, we only listen to any actions of the type `UPDATE.TEXT`, and use the value that the action carries as our new state.

Then, we create an stateful interface to our reducer, which we can now integrate into our component.

**Putting it all together**
```js
import React from 'react';
import Flux, { Reducer, Context, connect } from 'fluxette';

// constants
const UPDATE = { TEXT: 'UPDATE_TEXT' };

// actions
const update = { text: value => ({ type: UPDATE.TEXT, value }) };

// reducer store
const updater = Reducer('', {
	[UPDATE.TEXT]: (state, action) => action.value
});

// flux interface
const flux = Flux(updater);

@connect(state => ({ text: state }))
class Updater extends React.Component {
	change(e) {
		let { dispatch } = this.context.flux;
		dispatch([update.text(e.target.value)]);
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

## Middleware
`fluxette` supports and loves middleware. The middleware system uses functional inheritance, so you can compose your interface by using monads. If you want to do something with the actions on each dispatch, simply wrap the `dispatch` method and call the super to proxy the actions through. You can modify the behavior of methods other than `dispatch`, such as the state getter, history getter, hydrator (`init`), or even add your own functions. You can even depend on other middleware and build on top of their functionality! This means that the possibilities for extending the `fluxette` API are limitless. See our own [`normalize` middleware](https://github.com/edge/fluxette/blob/master/src/middleware/normalize.js) for an example of how to write one.

When you use just a few middleware, you can just compose them normally.
```js
import { Interface, normalize } from 'fluxette';

let I = normalize(Interface());
```

When you have lots of middleware, you can write a reducer function to make them easier to trace.
```js
import { Interface, normalize } from 'fluxette';
import { async, promise, thunk, thunkExtended } from './middleware';

let I = [
	normalize,
	async,
	promise('REQUEST', 'DONE', 'FAIL'),
	thunk, thunkExtended
].reduceRight((i, m) => m(i), Interface());
```

### Cooperation
`fluxette` has no convention for the arguments that any middleware function takes, as long as the final dispatch is called with an array of actions and an optional `update` boolean. However, you should try to make your middleware composable. You can do this by adding your own method to the interface, calling `dispatch` at the end of your middleware chain. Certain middleware, such as async and promise implementations, may not propagate to the next middleware at all.

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

**Multiplex**
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
Pass your logger/debugger to `flux.hook` when you want to process state changes and dispatches, and `flux.unhook` when you're done.

```js
let logger = (state, actions) => {
	sendToDashboard(state);
	alertTimeMachine(actions);
}

flux.hook(logger);

flux.unhook(logger);
```

## Isomorphic Flux
Universal flux is very easy. Because `fluxette` doesn't use singletons, you can create new instances on the fly. Creating new instances of `Fluxette` is extremely cheap, especially because you can keep your instance of `Interface`.

```js
import { Bridge, Interface, Context } from 'fluxette';
import stores from './stores';
import App from './views';

let I = Interface();

server.route('/', (req, res) => {
	let flux = Bridge(Interface, stores);
	res.end(React.renderToString(
		<Connect flux={ flux }>
			{ () => <App /> }
		</Connect>
	));
})
```

## Asynchronous
Because `fluxette` is completely synchronous, it does not accommodate asynchronous functionality out of the box. It is still easy to implement, however, and there are many ways to do so.

For your classic request/success/failure behaviors, this would be the vanilla solution:
```js
import { dispatch } from 'flux';

// actions
let resource = {
	request: () => { type: RESOURCE.REQUEST },
	done: data => { type: RESOURCE.DONE, data },
	fail: err => { type: RESOURCE.FAIL, err }
};

let getResource = (data) => {
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

getResource(data);
```

If you find yourself writing a lot of async helpers, you can write yourself an async or Promise middleware.

## Store Dependencies
Store dependencies in vanilla flux is handled by using `waitFor`, but `waitFor` is hard to trace, and may result in unpredictable application behavior, such as infinite loops. The `fluxette` way to handle store dependencies is to instead split an action into two semantic actions, which will be dispatched in order. This is known as action-splitting, and it allows for declarative store dependencies, simultaneously improving clarity and preventing any possibility of mutual locks. In most Flux implementations, this would not be a viable solution, as dispatching twice results in an extra setState on each component. Since `fluxette` allows you to dispatch arrays of actions, atomic action handling is possible, and only one setState is called once the array has been fully processed. A dependency refactor should usually not involve changing component code; you can just make the relevant action creator return an array of actions instead. If you do not want to use action-splitting, you can implement a custom Store and use the [redux way](https://gist.github.com/gaearon/d77ca812015c0356654f).

## Tips
The `fluxette` factory is essentially a wrapper around the `fluxette` constructor, which autobinds methods and hides properties for your convenience and safety. If you use the factory, you can individually import methods from your base flux module. It is then entirely possible to use `fluxette` without import flux itself.

You can `import { Fluxette } from 'fluxette';` if you desire, thus allowing you to extend `fluxette` in whatever way would benefit your application.

Think of hooks as the post-dispatch counterpart of middleware. In fact, you can reuse some middleware as hooks, and vice-versa.

If you change the state, make sure that you return something with a different reference in order for your components to update.

`fluxette` works best when its internals are asynchronous; this ensures that it is fast. It is recommended that you keep asynchronous code outside of stores, but you can write asynchronous middleware if you wish.

In `fluxette`, *everything* is a function! That means that your Stores, middleware, and hooks can be plain functions if you so desire.

Actions dictate the state of your application. You should structure your application so that your application would have the same state whether the actions were processed by normal user interaction or by rehydration.

## Examples
Examples can be found [here](https://github.com/edge/fluxette/tree/master/examples).

## Testing
```sh
# npm i -g testem mocha
$ npm test
```

## Todo
* implement rewinding
* React and non-React builds
* add ~~lint~~, code coverage, CI, badges, etc.
* add examples (async, router, ~~flux-comparison~~, etc.)
* submit to HN
