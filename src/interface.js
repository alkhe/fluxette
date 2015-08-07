import { normalize, remove } from './util';

export default class {
	constructor(instance) {
		this.instance = instance;
	}
	dispatch(...args) {
		this.interop(normalize(args));
	}
	interop(...args) {
		this.process(...args);
	}
	process(actions, update = true) {
		if (actions.length > 0) {
			let { instance } = this;
			instance.process(actions);
			if (update) {
				instance.update(actions);
			}
		}
	}
	update(...args) {
		this.instance.update(...args);
	}
	init(state) {
		let { instance } = this;
		instance.history = [];
		instance.state = state !== undefined ? state : instance.store();
	}
	state() {
		return this.instance.state;
	}
	history() {
		return this.instance.history;
	}
	hook(...args) {
		this.instance.hooks.push(...args);
	}
	unhook(fn) {
		remove(this.instance.hooks, fn);
	}
};
