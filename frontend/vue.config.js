module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://0.0.0.0:8000",
        changeOrigin: true,
      },
    },
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
};
