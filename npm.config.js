import { optimize as oz } from 'webpack';

export default {
	entry: './src/index.js',
	output: {
		path: './lib',
		filename: 'index.js',
		library: 'fluxette',
		libraryTarget: 'commonjs2'
	},
	module: {
		loaders: [{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }]
	},
	plugins: [
		new oz.DedupePlugin(),
		new oz.OccurenceOrderPlugin(),
		new oz.UglifyJsPlugin({
			compressor: {
				screw_ie8: true,
				warnings: false
			}
		}),
		new oz.AggressiveMergingPlugin()
	]
}
