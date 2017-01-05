module.exports = {
	output: {
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'ReactDualListBox',
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components|vender_modules)/,
				loader: 'babel',
			},
		],
	},
};
