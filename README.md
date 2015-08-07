# fluxette

`fluxette` is a minimalist yet powerful Flux implementation, inspired by ideas from [Dan Abramov (@gaearon)'s talk on Redux](https://www.youtube.com/watch?v=xsSnOQynTHs).

## Table of Contents

* [Why?](#why)
* [Install](#install)
* [Getting Started](#getting-started)
* [API](#api)
* [Types](#types)
* [The Law of Functional Flux](#the-law-of-functional-flux)
* [Isomorphic Objects](#isomorphic-objects)
* [Reducer Archetype](#reducer-archetype)
* [Middleware](#middleware)
* [Rehydration](#rehydration)
* [Debugging](#debugging)
* [SSR](#ssr)
* [Asynchronous](#asynchronous)
* [Store Dependencies](#store-dependencies)
* [Store Composition](#store-composition)
* [Examples](#examples)
* [Testing](#testing)
* [Todo](#todo)
* [Influences](#Influences)

## Why?

Why fluxette? (We used to have a list of buzzwords here.)

"fluxette" means "little flux". That's exactly what it is, coming in at ~3 kB, minified and gzipped. As much as it is a library, it is also a concept, combining the advantages of orthogonal code with the robust design of Facebook Flux. Through only simple rules, it allows the creation and exploitation of very advanced design patterns. It relies only on the basic convention that your stores are pure functions in the form of `(State, Action) => State` (see [The Law of Functional Flux](#the-law-of-functional-flux)). As a result, its dispatcher exists as [one very beautiful line](https://github.com/edge/fluxette/blob/master/src/flux.js#L6). fluxette provides facilities for elements of Functional Flux that will cover 99% of your use cases, but you can always defer to writing a custom function if the need arises. This also makes migrating from other implementations in the family of functional Flux very easy (e.g. copy-paste from redux).

fluxette removes many of the headaches that you may have had with React and other flux implementations, such as Store dependencies (`waitFor`), superfluous `setState`s ("did the state really change?" and "I'm not done dispatching yet!"), listening to finer and coarser-grained updates, [`Uncaught Error: Invariant Violation: Dispatch.dispatch(...)`](http://i.imgur.com/YnI9TIJ.jpg), and more. With just a top-level wrapper and a React class decorator, integrating Flux into your components no longer requires complicated mixins or lots of boilerplate.

You can also extend the fluxette interface, allowing you to add your own functionality to the dispatcher (Middleware for async, thunks, Promises, advanced de/rehydration).

## Install

```sh
$ npm i --save fluxette
```
Browser builds (umd) are available [here](https://github.com/edge/fluxette/tree/master/dist).

## Getting Started

Let's say that you have a simple React component that you want to refactor with Flux.

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

This is a simple component that shows you the text that you've typed into a textbox right below it. We can interpret each event as an action of type `UPDATE` that carries the value of the textbox.

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

We also create a stateful interface bound to our reducer, which we can now integrate into our component.

**Putting it all together**

Here we import two things: the `@connect` decorator and the `Context` component. `Context` provides flux on the context to all of its children, which `@connect` then utilizes to manage listeners on your component.

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
		dispatch(update.text(e.target.value));
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
	document.getElementById('app')
);
```

## Types

In lack of a better type annotation system, I drafted [taxon](https://github.com/edge/taxon), which will be used here. It is similar to Flow.

```js
State: any

Action: { type: String, ...payload: Any }

Reducer: (state: State, action: Action) => State

Selector: Monad<State>

Listener: ([state: State, [actions: Array<Action>]]) => Void

Deriver: (...properties: State) => State

Flux: Fluxette

Generic: Shallow<Function>

Bound: { #Shallow<Function>, instance: Flux }
```

## API

### [Flux]: (#Factory) => Bound
```js
import Flux from 'fluxette';
```

### [Bridge]: (generic: Generic, #Factory) => Bound
```js
import { Bridge } from 'fluxette';
```

### [Interface]: () => Generic
```js
import { Interface } from 'fluxette';
```

### [Factory]: (store: Reducer | Shallow<Function> | Flux, [state: State]) => Flux
```js
import { Factory } from 'fluxette';
```

### [Store]: (shape: Shallow<Reducer>) => Reducer
```js
import { Store } from 'fluxette';
```

### [Reducer]: (initial: State, reducers: Shallow<Reducer>) => Reducer
```js
import { Reducer } from 'fluxette';
```

### [Filter]: (types: Array<Action>, reducer: Reducer) => Reducer
```js
import { Filter } from 'fluxette';
```

### [Mapware]: (listeners: Shallow<Function>) => Hook
```js
import { Mapware } from 'fluxette';
```

### [Context]: React.Component
```js
import { Context } from 'fluxette';
```

### [connect]: ([selector: Selector]) => React.Component
```js
import { connect } from 'fluxette';
```

### [select]: (getters: Array<Selector> | Selector, deriver: Deriver) => Selector
```js
import { select } from 'fluxette';
```

### [$normalize]: Monad<Generic>
```js
import { $normalize } from 'fluxette';
```

## The Law of Functional Flux
In the most general sense, Functional Flux relies on reducing actions into the state. Therefore, Stores or Reducers are pure functions with the signature `(State, Action) => State`. If a Store processes an action that it listens to, which results in a different state, it must return a value or reference different from what it was called with (i.e. `Old !== New`). This recursively cascades down to the root of the state tree. At the end of the dispatch, all listeners are called. Any of which that depend on data that could have possibly changed are called with new values or references, meaning that listeners can simply maintain an old reference to compare with the new one to determine whether the state has changed.

## Isomorphic Objects
Isomorphic Objects were initially created to support Server-Side Rendering, but have proven to be much more. They are now an important part of `fluxette`, as they are used in many elements like Middleware and Isomorphic Flux. They may be a little confusing at first, but are extremely useful once you understand them.

The default export of `fluxette` is a thin factory function:
```js
export default (...args) => Bridge(Interface(), Factory(...args));
```
We'll take a look at what each part of it does.

`Interface` creates a Generic Interface, which can be modified by middleware. Generic Interfaces are not bound to any instance of Flux, and cannot be used by themselves. In a loose sense, they are the "classes" or specifications for the Bound Interfaces that you will see later. You can use multiple Generic Interfaces to accommodate different design patterns.

`Factory` creates an instance of `Fluxette`, which is the minimal internal class that contains the history, state, hooks, and a reference to the Store that it uses. We will just refer to these as "Flux instances".

`Bridge` takes a Generic Interface and a Flux instance, creating a Bound Interface. Bound Interfaces are used to interact with your Flux instances, and they are what you will become most familiar with. There may be multiple Bound Interfaces created from different Generic Interfaces acting on a single instance.

Separating Interfaces from instances of Flux allows for advanced multiplexing and cooperation techniques.

## Reducer Archetype

```js
import subreducers from ...;

let reducer = (state = {}, action) => {
	if (action !== undefined) {
		for (let sub of subreducers) {
			state = sub(state, action);
		}
	}
	return state;
}
```

## Middleware
`fluxette` supports and loves middleware. The middleware system uses functional inheritance, meaning that Generic Interfaces are enhanced by using monads. If you want to do something with the actions on each dispatch, simply wrap the `dispatch` method and proxy the actions through. You can define the behavior of methods other than `dispatch`, such as the state getter, history getter, hydrator (`init`), or even your own functions. You can also depend on other middleware and build on top of their functionality! This means that the possibilities for extending the API are limitless. See our own [`$normalize` middleware](https://github.com/edge/fluxette/blob/master/src/middleware/normalize.js) for an example of how to write one.

When you use just a few middleware, you'd probably want to compose them normally.

```js
import { Interface, $normalize } from 'fluxette';
import { $async } from './middleware';

let I = $normalize($async(Interface()));
```

If you have lots of middleware, it's nice to reduce an array of them to make them easier to trace.

```js
import { Interface, $normalize } from 'fluxette';
import { $async, $promise, $thunk, $thunkExt } from './middleware';

let I = [
	$normalize,
	$async,
	$promise('REQUEST', 'DONE', 'FAIL'),
	$thunk, $thunkExt
].reduceRight((i, m) => m(i), Interface());
```

### Cooperation
`fluxette` has no convention for the arguments that any middleware function takes, as long as the final dispatch is called with an array of actions and an optional `update` boolean. However, you should try to make your middleware composable. For example, if you are writing some middleware that you expect to be a chain, you can branch off onto a different method at the head, and call a common method at the end of your middleware chain. Certain middleware, such as possible async and promise implementations, may not propagate to the next middleware at all, deferring dispatches to later.

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
Pass your logger/debugger to `hook` when you want to process state changes and dispatches, and `unhook` when you're done.

```js
let logger = (state, actions) => {
	sendToDashboard(state);
	alertTimeMachine(actions);
}

flux.hook(logger);

flux.unhook(logger);
```

## SSR
Universal flux is very easy. Because `fluxette` doesn't force you to use use singletons, you can create new instances on the fly. Creating new instances of `Fluxette` is extremely cheap, especially because you can keep your instance of the Generic Interface.

```js
import { Bridge, Interface, Context } from 'fluxette';
import stores from './stores';
import App from './views';

let I = Interface();

server.route('/', (req, res) => {
	let flux = Bridge(Interface, stores);
	res.end(React.renderToString(
		<Context flux={ flux }>
			{ () => <App /> }
		</Context>
	));
})
```

## Asynchronous
Because `fluxette` is completely synchronous, it does not accommodate asynchronous functionality out of the box. It is still easy to implement, however, and there are many ways to do so.

For your classic request/success/failure behaviors, this would be the vanilla solution:
```js
let { dispatch } = flux;

// actions
let resource = {
	request: () => { type: RESOURCE.REQUEST },
	done: data => { type: RESOURCE.DONE, data },
	fail: err => { type: RESOURCE.FAIL, err }
};

// async helper
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
Store dependencies in vanilla flux is handled by using `waitFor`, but `waitFor` is hard to trace, and may result in unpredictable application behavior, such as infinite loops. The `fluxette` way to handle store dependencies is to instead split an action into two semantic actions, which will be dispatched in order. This is known as action-splitting, and it allows for declarative store dependencies, simultaneously improving clarity and preventing any possibility of mutual locks. In most Flux implementations, this would not be a viable solution, as dispatching twice results in an extra setState on each component. Since `fluxette` allows you to dispatch arrays of actions, atomic action handling is possible, and only one setState is called once the array has been fully processed. A dependency refactor should usually not involve changing component code; you can just make the relevant action creator return an array of actions instead. If you do not want to use action-splitting, you can implement a short custom Store. See [Store Composition](#store-composition) for more details.

## Store Composition
Since Stores are just pure functions, they can easily be composed and reused.

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
import { Store } from 'fluxette';

let users = {};

let dispatchCount = (state = 0) => state + 1;

let store = Store(users);

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
* React and non-React builds
* add ~~lint~~, code coverage, CI, badges, etc.
* add examples (async, router, ~~flux-comparison~~, etc.)
* submit to HN

## Influences
* Unix
* @gaearon
* [Alan Baker on Occam's Razor](http://plato.stanford.edu/archives/sum2011/entries/simplicity/#OntPar)
