const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      "buffer": require.resolve("buffer/"),
      "timers": require.resolve("timers-browserify"),
      "stream": require.resolve("stream-browserify"),
    };

    config.plugins.push(
      new (require('webpack')).ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },
};
