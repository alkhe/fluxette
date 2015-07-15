import 'colors';

export default (a, b) => {
	if (a == b) {
		console.log(`Pass: ${a} == ${b}`.green);
	}
	else {
		console.log(`Fail: ${a} != ${b}`.red);
	}
}
