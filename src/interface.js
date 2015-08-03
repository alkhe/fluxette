import { normalize, deleteFrom } from './util';

export default class {
	constructor(flux) {
		this.instance = flux;
	}
	dispatch(...actions) {
		let { instance } = this;
		instance.process(normalize(actions));
	}
	process(...args) {
		this.instance.process(...args);
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
		deleteFrom(this.instance.hooks, fn);
	}
}
