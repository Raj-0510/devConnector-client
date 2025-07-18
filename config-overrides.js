const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    url: require.resolve("url"), // ✅ no slash
    url: require.resolve("url"),
  crypto: require.resolve("crypto-browserify"),
  stream: require.resolve("stream-browserify"),
  buffer: require.resolve("buffer"),
  process: require.resolve("process/browser"),
  };

  return config;
};
