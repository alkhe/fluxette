import w from 'webpack';
import fs from 'fs';
import path from 'path';

let resolve = {
		extensions: ['', '.js']
	},
	react = {
		root: 'React',
		commonjs2: 'react',
		commonjs: 'react',
		amd: 'react'
	},
	loaders = [{ test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }];

export default {
	build: (minify, filename) => {
		let plugins = [new w.optimize.OccurenceOrderPlugin()];
		if (minify) {
			plugins.push(
				new w.optimize.UglifyJsPlugin({
					compressor: {
						'screw_ie8': true,
						warnings: false
					}
				})
			);
		}
		return {
			entry: './src/index.js',
			output: {
				path: './dist',
				filename,
				library: 'fluxette',
				libraryTarget: 'umd'
			},
			module: {
				loaders
			},
			externals: {
				react
			},
			resolve,
			plugins
		};
	},
	test: () => ({
		entry: fs.readdirSync('./test').map(file => `./${ path.join('test', file) }`),
		output: {
			path: './dist',
			filename: 'testem.js'
		},
		module: {
			loaders
		},
		resolve,
		plugins: [new w.optimize.UglifyJsPlugin({
			compressor: {
				'screw_ie8': true,
				warnings: false
			}
		})]
	})
};
