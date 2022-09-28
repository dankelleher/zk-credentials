const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(function (req, res, next) {
        console.log('Request Type:', req.method);
        console.log('Request URL:', req.originalUrl);
        console.log('Request Body:', req.body);
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        next();
    });
};