// const { useBabelRc, override, addWebpackResolve, addWebpackPlugin} = require('customize-cra');
// const { ProvidePlugin } = require('webpack');

// module.exports = override(
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useBabelRc(),
//     addWebpackPlugin(
//         new ProvidePlugin({
//             Buffer: ['buffer', 'Buffer'],
//         }),
//     ),
//     addWebpackResolve({
//         fallback: {
//             assert: require.resolve('assert'),
//             buffer: require.resolve('buffer'),
//             crypto: require.resolve('crypto-browserify'),
//             fs: false,
//             path: require.resolve('path-browserify'),
//             stream: require.resolve('stream-browserify'),
//         }
//     }),
    
// )

const { ProvidePlugin } = require('webpack');

module.exports = function (config, env) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(m?js|ts)$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
      ],
    },
    plugins: [
      ...config.plugins,
    //   new ProvidePlugin({
    //     process: 'process/browser',
    //   }),
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    resolve: {
      ...config.resolve,
      fallback: {
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        fs: false,
        path: require.resolve('path-browserify'),
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  };
};