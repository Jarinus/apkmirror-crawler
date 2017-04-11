const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};

fs.readdirSync('node_modules').filter(x => {
    return ['.bin'].indexOf(x) === -1;
}).forEach(mod => {
    nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
    context: __dirname + '/app',
    entry: './app.js',
    target: 'node',
    output: {
        path: __dirname,
        filename: 'crawler.js'
    }
};
