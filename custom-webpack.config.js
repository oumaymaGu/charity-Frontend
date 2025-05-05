const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      net: false, // Ignore the 'net' module
      tls: false, // Ignore the 'tls' module
      fs: false,  // Ignore the 'fs' module
      crypto: require.resolve('crypto-browserify'), // Polyfill for 'crypto'
      stream: require.resolve('stream-browserify'), // Polyfill for 'stream'
      buffer: require.resolve('buffer/')            // Polyfill for 'buffer'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      global: 'window', // Define 'global' as 'window'
      Buffer: ['buffer', 'Buffer'], // Polyfill for 'Buffer'
      process: 'process/browser'    // Polyfill for 'process'
    })
  ]
};