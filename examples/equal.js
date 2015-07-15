export default (a, b) => {
	console.log(a == b
		? `Pass: ${a} == ${b}`
		: `Fail: ${a} != ${b}`);
}
