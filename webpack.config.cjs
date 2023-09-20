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
    fallback: {
      "path": require.resolve("path-browserify")
    }
  },
};