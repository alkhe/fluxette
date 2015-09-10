import { optimize as oz } from 'webpack';

export default production => {
	let filename = production
		? 'fluxette.min.js'
		: 'fluxette.js';

	let plugins = [
		new oz.DedupePlugin(),
		new oz.OccurenceOrderPlugin()
	].concat(production
		? [
			new oz.UglifyJsPlugin({
				compressor: {
					screw_ie8: true,
					warnings: false
				}
			}),
			new oz.AggressiveMergingPlugin()
		] : []
	);

	return {
		entry: './src/index.js',
		output: {
			path: './dist',
			filename,
			library: 'fluxette',
			libraryTarget: 'umd'
		},
		module: {
			loaders: [{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }]
		},
		plugins
	};
}
