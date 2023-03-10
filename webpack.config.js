const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'build'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.join(__dirname, 'src'),
            '@core': path.join(__dirname, 'src/core'),
            '@exception': path.join(__dirname, 'src/exceptions'),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: '/node_modules/',
            },
        ],
    },
}
