export default {
	devtool: 'eval',
	entry: './test/',
	output: {
		path: './dist',
		filename: 'testem.js'
	},
	module: {
		loaders: [{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }]
	}
};
