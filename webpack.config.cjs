const path = require('path');

module.exports = {
  entry: './server.js', 
  output: {
    filename: 'bundle.js', // specify the desired name of the bundled output file
    path: path.resolve(__dirname, 'v3.js'), // specify the output directory for the bundled file
  },
  module: {
    rules: [
      // add any necessary rules for processing your server-side code (e.g., babel-loader for transpiling)
    ],
  },
  resolve: {
    // fallback: {
    //   "path": require.resolve("path-browserify"),
    //   "async_hooks" : require.resolve("async_hooks"),
    //   "stream" : require.resolve("stream"),
    //   "fs" : require.resolve("fs"),
    //   "crypto" : require.resolve("crypto"),
    //   "zlib" : require.resolve("zlib"),
    //   "tty": false,
    //   "timers": false,
    //   "util": require.resolve("util/"),
    //   "buffer": false,
    //   "assert": false,
    //   "crypto": false,
    //   "querystring": false,
    //   "zlib" : require.resolve('browserify-zlib'), // or 'zlib' if you prefer node's implementation
    //   },
    extensions: ['.js', '.jsx', '.json'],
    modules: ['node_modules'],
  },
  stats: {
    errorDetails: true,
  }
};