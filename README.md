# fluxette

`fluxette` is a minimalist Flux implementation, based off of ideas from [Dan Abramov (@gaearon)'s talk on Redux](https://www.youtube.com/watch?v=xsSnOQynTHs).

## Table of Contents

* [Why](#why)
* [Install](#install)
* [Getting Started](#getting-started)
* [API](#api)
* [Rehydration](#rehydration)
* [Isomorphic Flux](#isomorphic-flux)
* [Asynchronous](#asynchronous)
* [Testing](#testing)
* [Todo](#todo)

## Why

Why `fluxette`? (Some buzzwords to attract you.)

* declarative and functional
* minimalist
* isomorphic
* faciliated rehydration
* unopinionated
* loosely coupled
* unidirectional
* inverted control
* no boilerplate
* concise
* React integration

## Install

```sh
$ npm i --save fluxette
```

## Getting Started

First, create your action types. These are important, because types define the behaviors your application. They will be used by your stores and in your actions. `fluxette` has no notion of action creators; they are simply userland functions that aid you in creating actions. You can use `fluxette` without any action creators at all.

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

Then, create your stores. Stores are pure functions that reduce an action into your state, much like an accumulator. All stores should have the signature: `(oldstate, action) => newstate`.
`fluxette` provides a store creator function, which takes an initial state and your store functions. Stores should be fast and synchronous, so that rehydration is easy.

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
		[GAME.RESET]: state => ({ ...state , points: 0, wins: 0, losses: 0 }),
		[GAME.WIN]: state => ({ ...state, wins: state.wins + 1, points: 0 }),
		[GAME.LOSE]: state => ({ ...state, losses: state.losses + 1, points: 0 })
	})
}
```

Now, create your action creators. Action creators are not necessary, but are highly recommended in general. It is up to you on how to implement your action creators, but I recommend using a function that takes any relevant arguments, and using the `state` function from your base flux module if your action creator relies on state to create the action. Action creators can return an action or an array of actions. They can also use other action creators for composable application behavior.

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
import { user, game } from './creators';

const flux = new Flux(stores);

export default flux;
export const state = ::flux.state
```

In your application, the majority of your interactions with `fluxette` should consist of dispatching actions.

**something.js**
```js
import flux from './flux';
import game from './flux/creators';

flux.dispatch(game.addpoints(100));

flux.dispatch(game.reset());
```

## API

### new Flux(stores)
The `fluxette` constructor takes an object with keys mapping to top-level stores.

```js
const flux = new Flux({
	storeA: @Store,
	storeB: @Store
});
```

### flux.state()
`flux.state()` returns the object representation of the state.

```js
flux.state()

// {
//     storeA: @Store.state,
//     storeB: @Store.state
// }
```

### flux.dispatch(...actions)
`flux.dispatch(...actions)` takes an action, an array of actions, or an argument list of actions. It synchronously runs all actions through each store reducer, and calls any registered listeners afterwards.

```js
// Single action
flux.dispatch({ type: ACTION_TYPE });

// Array of actions
flux.dispatch([{ type: ACTION_TYPE }, { type: OTHER_ACTION_TYPE }]);

// Argument list of actions
flux.dispatch({ type: ACTION_TYPE }, { type: OTHER_ACTION_TYPE });
```

### flux.hook(fn)
`flux.hook(fn)` registers a function as a listener. The listener should have a signature of `data => {}`. Listeners will be called in the order that they were registered.

```js
// Log all state changes to console
flux.hook(::console.log);

// In a React class
flux.hook(::this.setState);
// However, it is better to use the flux.connect decorator

// Arbitrary function
flux.hook(data => {
	// do something
});
```

### flux.unhook(fn)
`flux.unhook(fn)` deregisters a listener that was `flux.hook`ed before.

```js
let fn = data => {
	// do something
};

// fn will be called on state changes
flux.hook(fn);

// fn will no longer be called on state changes
flux.unhook(fn);
```

### flux.history
`flux.history` contains an array of all actions that have been dispatched through `fluxette`. This is useful for rewinding state and rehydration.

```js
flux.dispatch(actionA, actionB, actionC);
flux.dispatch([actionD, [actionE, actionF]], actionG);

flux.history
// [actionA, actionB, actionC, actionD, actionE, actionF, actionG]
```

### flux.connect
`flux.connect` is a class decorator that lets you easily integrate `fluxette` into your React classes. It takes an optional function that makes your component state more specific.

```js
import { connect } from './flux';

@connect()
export default class extends React.Component {
	// ...
	render() {
		this.state
		// result of flux.state()
	}
}

// or

@connect(state => state.domain)
export default class extends React.Component {
	// ...
	render() {
		this.state
		// result of flux.state().domain
	}
}
```

## Rehydration
The action history is always available on `flux.history`. When you want to save the state for later rehydration, simply serialize `flux.history` however you want and send it to the server.

When you want to retrieve the state from the previous session, use any method to get the deserialized state, and simply pass the state through `flux.dispatch` before any listeners are registered.

```js
let history = getDeserializedActionHistorySomehow();

const flux = new Flux(stores);

flux.dispatch(history);

// flux is now rehydrated
```

## Isomorphic Flux
Isomorphic Flux is as easy as creating a new instance of `fluxette`. It is up to you how you coordinate synchronization between the server and client.

```js
let flux = new Flux(stores);
```

## Asynchronous
Because `fluxette` does not care about how your action creators work, asynchronous data fetching should not be a problem in your application. This makes it easy to work with `React Router`. When you want to update your state, simply call `flux.dispatch(action)`. This can be from a callback, a Promise resolution, or something else.

## Testing
```sh
$ npm test
```

## Todo
* add organized tests
* add build system
* add more examples
* add more philosophy and best practices to README
* submit to HN
* implement nested stores
