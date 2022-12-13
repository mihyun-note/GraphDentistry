const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://kwhcclab.com:20701",
      changeOrigin: true,
    })
  );
};
