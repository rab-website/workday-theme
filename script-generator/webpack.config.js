const webpack = require('webpack');
const uglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        'scripts': ['./src/scripts.js']
    },
    output: {
        filename: 'build/dist/[name].min.js',
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                // Only run `.js` files through Babel
                test: /\.(js)$/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new uglifyJSPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
};
