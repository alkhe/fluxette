# fluxette

`fluxette` is a minimalist yet powerful Flux implementation, inspired by ideas from the Unix philosophy and [Dan Abramov (@gaearon)'s talk on Redux](https://www.youtube.com/watch?v=xsSnOQynTHs).

## Table of Contents

* [Why?](#why)
* [Install](#install)
* [Getting Started](#getting-started)
* [API](#api)
* [Middleware](#middleware)
* [Rehydration](#rehydration)
* [Isomorphic Flux](#isomorphic-flux)
* [Asynchronous](#asynchronous)
* [Store Dependencies](#store-dependencies)
* [Tips](#tips)
* [Examples](#examples)
* [Testing](#testing)
* [Todo](#todo)

## Why?

Why `fluxette`? (We used to have a list of buzzwords here.)

`fluxette` means "little flux". That's exactly what it is, coming in at 2.8 kB, minified and gzipped. But as the great Master Yoda said, *size matters not*. The goal of `fluxette` is to make your React/Flux development experience as smooth as possible. `fluxette` has many recommended practices, but, in accordance with the philosophy of Unix, it does not enforce any "one true way". `fluxette` allows you to do things in many different ways, and is extremely modular and extensible. The codebase is very simple and robust; there is no black magic going on anywhere [(KISS)](https://en.wikipedia.org/wiki/KISS_principle). It only relies on the simple assumption that your stores are pure functions in the form of `(state, action) => state`. As a result, our dispatcher exists as [one very beautiful line](https://github.com/edge/fluxette/blob/master/src/flux.js#L17). This also makes migrating from other implementations in the family of functional Flux very easy (e.g. copy-paste from redux).

`fluxette` also removes many of the headaches that you may have had with React and other flux implementations, such as Store dependencies (`waitFor`), superfluous `setState`s ("when did the state really change?" and "I'm not done dispatching yet!"), listening to finer and coarser-grained updates, [`Uncaught Error: Invariant Violation: Dispatch.dispatch(...)`](http://i.imgur.com/YnI9TIJ.jpg), and more. With two simple React class decorators, connecting your components with `fluxette` no longer requires complicated mixins.

You can also easily extend the `fluxette` interface, allowing you to add your own functionality to the dispatcher (Middleware, async, thunks, Promises) at will.

## Install

```sh
$ npm i --save fluxette
```
Browser builds (umd) are available [here](https://github.com/edge/fluxette/tree/master/dist).

## Middleware
Not only does `fluxette` support middleware, it bring a whole new meaning to it. `fluxette` middleware is written as a class decorator for `Interface` (don't decorate methods, because that prevents the user from ordering them correctly). If you want to do something with the actions on each dispatch, simply override the `dispatch` method and call the super to proxy the actions through. Because you extend the `Interface` class, you can modify the behavior of methods other than dispatch, such as the state getter, history getter, hydrator (`init`), or even add your own functions. You can even depend on other middleware and build on top of their functionality! This means that the possibilities for extending the `fluxette` API are limitless. See our own [`normalize` middleware](https://github.com/edge/fluxette/blob/master/src/middleware/normalize.js) for an example of how to write one.

Middleware is executed in the order decorated. Middleware closest to the class is executed last.

This is an example of using middleware:
```js
import { Interface, normalize } from 'fluxette';
import stores from './stores';
import { async, promise, thunk, thunkExtended } from './middleware';

let flux = new (
	@normalize
	@async
	@promise('REQUEST', 'DONE', 'FAIL')
	@thunk @thunkExtended
	class extends Interface {}
)(stores);
```

### Cooperation
`fluxette` has no convention for the arguments that any middleware function takes, as long as the final dispatch is called with an array of actions and an optional `update` boolean. However, you should try to make your middleware composable. Consider a group of middleware that work together. We'll call the first one the head, and the last one the tail. It would be best to preserve the format of `(actions, [update])`, accepted by the head and called by the tail. Certain middleware, such as async and promise implementations, may not propagate actions to the next middleware at all.

## Rehydration
`fluxette` supports both imperative and declarative rehydration. You may pick whichever suits your needs more.

**Imperative**
```js
// dehydrating
flux.dispatch(actions);
let history = flux.history();

sendToServer({ history });

// rehydrating
let { history } = getFromServer();
flux.process(history);
```

This example uses the `process` method, which skips all middleware.

**Declarative**
```js
// dehydrating
flux.dispatch(actions);
let state = flux.state();

sendToServer({ state });

// rehydrating
let { state } = getFromServer();
flux.init(state);
```

If for any reason you wanted to use both methods, this is one possible way:

**Multiplex**
```js
// dehydrating
let state = flux.state();
flux.dispatch(actions);
let old = flux.state();
let history = flux.history();

sendToServer({ state: old, history });

// rehydrating
let { state, history } = getFromServer();
flux.init(state);
flux.process(history);
```


## Debugging
Simply pass your logger/debugger to `flux.hook` when you want to log state changes, and `flux.unhook` when you're done. You can also use `Mapware` to map over actions by type.

```js
let logger = (actions, state) => {
	sendToDashboard(state);
	alertTimeMachine(actions);
}

let ware = Mapware({
	actionA: () => { console.log('Action A was dispatched'); }
});

hook(logger);
hook(ware);

unhook(logger);
unhook(ware);
```

## Rehydration
The action history is always available from `flux.history()`. When you want to save the state for later rehydration, simply serialize `flux.history` however you want and send it to the server.

When you want to retrieve the state from the previous session, send the state, deserialize it, and simply pass it through `flux.hydrate`.

```js
let history = getDeserializedActionHistoryPromise();

const flux = Flux(stores);

// components take default state

(async () => {
	flux.hydrate(await history);

	// flux is now rehydrated
})();
```

## Isomorphic Flux
Isomorphic Flux is as easy as creating a new instance of `fluxette`. It is your choice how you coordinate synchronization between the server and client.

```js
let flux = Flux(stores);
```

## Asynchronous
Because `fluxette` does not care about how your action creators work, asynchronous data fetching should not be a problem in your application. This makes it easy to work with `React Router`. When you want to update your state, simply call `flux.dispatch(action)`. This can be from a callback, a Promise resolution/await, or something else. It is also possible to write a Promise middleware to simplify your asynchronous I/O tasks.

```js
async function doSomething(data) {
	let result = await somePromise(data);
	dispatch(actions.doSomething(result));
}

doSomething(foo);
```

For your classic request/success/failure behaviors, the following approach is viable:
```js
// actions
let api = {
	items: {
		request: () => ({ type: API.ITEMS.REQUEST }),
		done: items => ({ type: API.ITEMS.DONE, items }),
		fail: error => ({ type: API.ITEMS.FAIL, error })
	}
};

// async helper
let getItems = () => {
	dispatch(api.items.request());
	asyncRequest((err, res) => {
		if (err) {
			flux.dispatch(api.items.fail(err));
		}
		else {
			flux.dispatch(api.items.done(res.items));
		}
	});
}
```

## Store Dependencies
Store dependencies in vanilla flux is handled by using `waitFor`, but `waitFor` is hard to trace, and may result in unpredictable application behavior, such as infinite loops. The `fluxette` way to handle store dependencies is to instead split an action into two semantic actions, which will be dispatched in order. This is known as action-splitting, and it allows for declarative store dependencies, simultaneously improving clarity and preventing any possibility of mutual dependencies. In most Flux implementations, this would not be a viable solution, as dispatching twice results in an extra setState on each component. Since `fluxette` allows you to dispatch arrays of actions, atomic action handling of arrays is possible, and only one setState is called once the array has been fully processed. A dependency refactor should usually not involve changing component code; you can just make the relevant action creator return an array of actions instead. If you do not want to use action-splitting, you can use the [redux way](https://gist.github.com/gaearon/d77ca812015c0356654f) as well.

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
# npm i -g testem
$ npm test
```

## Todo
* implement rewinding
* React and non-React builds
* declarative rehydration
* make isomorphic easier
* add ~~lint~~, code coverage, CI, badges, and all that jazz
* add more examples (async, router, ~~flux-comparison~~, etc.)
* rewrite docs
* submit to HN
