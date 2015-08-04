import { deleteFrom } from './util';

export default () => ({
	dispatch(...args) {
		this.process(...args);
	},
	process(...args) {
		this.instance.process(...args);
	},
	update(...args) {
		this.instance.update(...args);
	},
	init(state) {
		let { instance } = this;
		instance.history = [];
		instance.state = state !== undefined ? state : instance.store();
	},
	state() {
		return this.instance.state;
	},
	history() {
		return this.instance.history;
	},
	hook(...args) {
		this.instance.hooks.push(...args);
	},
	unhook(fn) {
		deleteFrom(this.instance.hooks, fn);
	}
});
