const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://port-0-lmserver-7xwyjq992llj191csy.sel4.cloudtype.app', // 백엔드 서버의 주소
      changeOrigin: true,
    })
  );
};
