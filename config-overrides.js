const { useBabelRc, override, addWebpackResolve} = require('customize-cra');

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    addWebpackResolve({
        fallback: {
            assert: require.resolve('assert'),
            buffer: require.resolve('buffer'),
            crypto: require.resolve('crypto-browserify'),
            fs: false,
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
        }
    })
)