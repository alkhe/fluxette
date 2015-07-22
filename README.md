# fluxette

`fluxette` is a minimalist Flux implementation, inspired by ideas from [Dan Abramov (@gaearon)'s talk on Redux](https://www.youtube.com/watch?v=xsSnOQynTHs).

## Table of Contents

* [Why?](#why)
* [Install](#install)
* [Getting Started](#getting-started)
* [API](#api)
* [Debugging](#debugging)
* [Rehydration](#rehydration)
* [Isomorphic Flux](#isomorphic-flux)
* [Asynchronous](#asynchronous)
* [Middleware](#middleware)
* [Tips](#tips)
* [Examples](#examples)
* [Testing](#testing)
* [Todo](#todo)

## Why?

Why `fluxette`? (Some buzzwords to attract you.)

* declarative and functional
* minimalist
* exhaustive
* modular
* isomorphic
* faciliated rehydration
* unopinionated
* loosely coupled
* unidirectional
* inverted control
* no boilerplate
* no switch statements!
* concise
* small (~100 sloc)
* React integration

## Install

```sh
$ npm i --save fluxette
```
Browser builds are available [here](https://github.com/edge/fluxette/tree/master/dist).

## Getting Started

As you will see, `fluxette` has many recommended practices, but never forces you to do something in a particular way.

First, create your action types. While a module exporting constants isn't strictly necessary to use `fluxette`, they are recommended for a structured application. These are important, because they define the behaviors your application. They will be used by your stores and in your actions. `fluxette` has no notion of action creators; they are simply userland functions that aid you in creating actions. You can use `fluxette` without any action creators at all.

**types.js**
```js
export default {
	USER: {
		SETNAME: 'USER_SETNAME',
		SETEMAIL: 'USER_SETEMAIL'
	},
	GAME: {
		ADDPOINTS: 'GAME_ADDPOINTS',
		RESET: 'GAME_RESET',
		WIN: 'GAME_WIN',
		LOSE: 'GAME_LOSE'
	}
}
```

Then, create your stores. Stores are values (primitives, arrays, objects) bound to pure functions (reducers) that reduce an action into your state, much like an accumulator. All reducers should have the signature: `(oldstate, action) => newstate`. While you don't necessary have to use pure functions, it is recommended to do so to keep a maintainable project.
`fluxette` provides a store creator function, which takes an initial state and your reducers. Stores should be fast and synchronous, so that rehydration is easy.

**stores.js**
```js
import { Store } from 'fluxette';
import { USER, GAME } from './types';

export default {
	user: Store({ username: '', email: '' }, {
		[USER.SETNAME]: (state, action) => ({ ...state, username: action.name }),
		[USER.SETEMAIL]: (state, action) => ({ ...state, email: action.email })
	}),
	game: Store({ points: 0, wins: 0, losses: 0 }, {
		[GAME.ADDPOINTS]: (state, action) => ({ ...state, points: state.points + action.points }),
		[GAME.RESET]: state => ({ ...state, points: 0, wins: 0, losses: 0 }),
		[GAME.WIN]: state => ({ ...state, wins: state.wins + 1, points: 0 }),
		[GAME.LOSE]: state => ({ ...state, losses: state.losses + 1, points: 0 })
	})
}
```

Now, create your action creators. Action creators are not necessary, but are recommended in general. It is up to you on how you implement your action creators, but one good way is to use functions that take relevant arguments, and use the `state` function from your base flux module if your action creator relies on state to create the action. Action creators can return an action or an array of actions. They can also use other action creators for composable application behavior.

**creators.js**
```js
import { USER, GAME } from './types';
import { state } from '.';

let actions = {
	user: {
		setname: name => ({ type: USER.SETNAME, name }),
		setemail: email => ({ type: USER.SETEMAIL, email })
	},
	game: {
		addpoints: points => {
			let { game: { points: before } } = state();
			let total = before + points;
			if (total >= 1000) {
				return actions.game.win();
			}
			else if (total <= -1000) {
				return actions.game.lose();
			}
			return { type: GAME.ADDPOINTS, points };
		},
		reducepoints: points => actions.game.addpoints(-points),
		reset: () => ({ type: GAME.RESET }),
		win: () => ({ type: GAME.WIN }),
		lose: () => ({ type: GAME.LOSE })
	}
};

export default actions;
```

Finally, create your instance of `fluxette`.

**index.js**
```js
import Flux from 'fluxette';
import stores from './stores';

const flux = Flux(stores);

export default flux;
```

In your application, the majority of your interactions with `fluxette` should consist of dispatching actions.

**something.js**
```js
import { dispatch } from './flux';
import { user, game } from './flux/creators';

dispatch(user.setemail('user@example.org'));
dispatch(game.addpoints(100));
dispatch(game.reset());
```

## API

### Flux(stores, [middleware])
The `fluxette` factory method takes a single Store, an object with keys mapping to Stores, an array of Stores, or a mixture of the latter. Optionally, it will also take a function or array functions as middleware with the signature `actions => actions`.

```js
const flux = Flux({
	storeA: @Store,
	storeB: @Store,
	domainA: {
		storeC: @Store
	},
	domainB: [
		storeD: @Store,
		storeE: @Store
	]
}, actions => actions.map(transform));
```

### flux.state()
`flux.state()` returns the object representation of the state. It is guaranteed to be the same between dispatches.

```js
import { state } from './flux';

state()

// {
//     storeA: @Store.state,
//     storeB: @Store.state,
//     domainA: {
//        storeC: @Store.state
//     },
//     domainB: [
//         @Store.state,
//         @Store.state
//     ]
// }
```

### flux.dispatch(...actions)
`flux.dispatch(...actions)` takes an action, an array of actions, or an argument list of actions. It synchronously runs all actions through each store reducer, and calls any registered listeners afterwards.

```js
import { dispatch } from './flux';

// Single action
dispatch({ type: ACTION_TYPE });

// Array of actions
dispatch([{ type: ACTION_TYPE }, { type: OTHER_ACTION_TYPE }]);

// Argument list of actions
dispatch({ type: ACTION_TYPE }, { type: OTHER_ACTION_TYPE });
```

### flux.hook(fn)
`flux.hook(fn)` registers a function as a listener. The listener should have a signature of `(actions, state) => {}`. Listeners will be called in the order that they were registered.

```js
import { hook } from './flux';

// Log all new actions and the state to console
hook(::console.log);

// In a React class
hook((actions, state) => this.setState(state));
// However, it is better to use the flux.connect decorator

// Arbitrary function
hook((actions, state) => {
	// do something
});
```

### flux.unhook(fn)
`flux.unhook(fn)` deregisters a listener that was `flux.hook`ed before.

```js
import { hook, unhook } from './flux';

let fn = (actions, state) => {
	// do something
};

// fn will be called on dispatch
hook(fn);

// fn will no longer be called on state changes
unhook(fn);
```

### flux.history()
`flux.history()` returns the array of all actions that have been dispatched through `fluxette`. This is useful for rewinding state and de/rehydration.

```js
import { dispatch, history } from './flux';

dispatch(actionA, actionB, actionC);
dispatch([actionD, [actionE, actionF]], actionG);

history()
// [actionA, actionB, actionC, actionD, actionE, actionF, actionG]
```

### flux.connect([specifier], [identifier])
`flux.connect` is a class decorator that lets you easily integrate `fluxette` into your React classes. It takes an optional function that makes your component state more specific. Your specifier does not necessarily need to subscribe to a Store, but if it does, your component will have a nice performance boost due to Store caching. It also takes an optional identifier ('flux' by default) that determines what key on your state it will be stored as.

```js
import { connect } from './flux';

@connect()
export default class extends React.Component {
	// ...
	render() {
		this.state.flux
		// result of flux.state()
	}
}

// or

@connect(state => state.domain, 'domain')
export default class extends React.Component {
	// ...
	render() {
		this.state.domain
		// result of flux.state().domain
	}
}
```

### Store(state, reducers)
`Store` is a factory method that takes an initial state and an object containing reducers, with each key being your desired mapping from an action type to a reducer. It produces a pure state machine function that takes an action or an array of actions.

```js
import { Store } from 'fluxette';

const store = Store({}, {
	actionA: (state, action) => ({ ...state, a: action.item })
})
```

### Mapware(reducers)
Because Stores are just functions that reduce over an array of actions, you can use them as middleware and hooks. `fluxette` provides a further level of abstraction by including `Mapware`, which reduces over actions themselves, instead of state.

```js
import { Mapware } from 'fluxette';

const ware = Mapware({
	actionA: (action) => ({ ...action, a: transform(action.a) })
})
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
The action history is always available on `flux.history`. When you want to save the state for later rehydration, simply serialize `flux.history` however you want and send it to the server.

When you want to retrieve the state from the previous session, use your method to get the deserialized state, and simply pass the state through `flux.dispatch`.

```js
let history = getDeserializedActionHistoryPromise();

const flux = Flux(stores);

// components take default state

(async () => {
	flux.dispatch(await history);

	// flux is now rehydrated
})();
```

## Isomorphic Flux
Isomorphic Flux is as easy as creating a new instance of `fluxette`. It is up to you how you coordinate synchronization between the server and client.

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

## Middleware
Middleware are a simple but powerful addition to the dispatcher, and `fluxette` allows you to hook your own middleware into the dispatch cycle. Every time a dispatch is made, each middleware will be called in order with the array of actions being dispatched, and the dispatcher expects it to return a new array of actions. The stores will only ever see actions returned by the middleware. This allows you to transform the actions, drop actions, or perform any other behavior required by your application, such as setting cookies and localstorage. This solves the problem of discerning between the Store and non-Store aspects of eminent data. `fluxette` also provides the `Mapware` factory to automatically reduce over each action by type.

```js
const ware = Mapware()

const flux = Flux(stores, )

```

## Tips
The `fluxette` factory is essentially a wrapper around the `fluxette` constructor that autobinds methods and hides properties for your convenience and safety. If you use the factory, you can individually import methods from your base flux module. It is entirely possible to use `fluxette` without import flux itself.

You can `import { Fluxette } from 'fluxette';` if you desire, thus allowing you to extend `fluxette` in whatever way would benefit your application.

Think of hooks as the post-dispatch counterpart of middleware. In fact, you can reuse some middleware as hooks, and vice-versa.

## Examples
Examples can be found [here](https://github.com/edge/fluxette/tree/master/examples).

## Testing
```sh
# npm i -g testem
$ npm test
```

## Todo
* React and non-React builds
* switch to webpack for builds
* implement rewinding
* add lint, code coverage, CI, badges, and all that jazz
* make isomorphic easier
* add more examples (async, router, flux-comparison, etc.)
* add more philosophy and best practices to README
* submit to HN
